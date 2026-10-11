require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Configure Cloudinary if credentials exist
const isCloudinaryConfigured = () => {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

const ensureCloudinaryConfig = () => {
  if (isCloudinaryConfigured()) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    return true;
  }
  return false;
};

// Initial config attempt
ensureCloudinaryConfig();

/**
 * Uploads a file buffer to Cloudinary with proper format detection (PDF / DOCX)
 * @param {Buffer} buffer 
 * @param {string} originalname 
 * @param {string} mimetype 
 * @returns {Promise<{ url: string, publicId: string }>}
 */
const uploadBufferToCloudinary = (buffer, originalname = 'resume.pdf', mimetype = 'application/pdf') => {
  return new Promise((resolve, reject) => {
    if (!ensureCloudinaryConfig()) {
      const safeName = originalname ? originalname.replace(/[^a-zA-Z0-9._-]/g, '_') : 'resume.pdf';
      return resolve({
        url: `https://storage.placeholder-resumes.internal/${Date.now()}_${safeName}`,
        publicId: `local_${Date.now()}`,
        simulated: true,
      });
    }

    const lowerName = (originalname || '').toLowerCase();
    const isPdf = lowerName.endsWith('.pdf') || mimetype === 'application/pdf';
    const isDocx = lowerName.endsWith('.docx') || mimetype.includes('wordprocessingml');
    const isDoc = lowerName.endsWith('.doc') || mimetype.includes('msword');

    // Extension suffix to preserve file identity
    const ext = isPdf ? '.pdf' : isDocx ? '.docx' : isDoc ? '.doc' : '';
    const cleanBaseName = (originalname || 'resume')
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_');

    let hasResolved = false;
    const timeoutTimer = setTimeout(() => {
      if (!hasResolved) {
        hasResolved = true;
        console.warn('Cloudinary upload timed out after 7s. Proceeding with local fallback URL.');
        resolve({
          url: `https://storage.placeholder-resumes.internal/${Date.now()}_${originalname}`,
          publicId: `fallback_${Date.now()}`,
          simulated: true,
        });
      }
    }, 7000);

    // PDFs uploaded as 'image' with format 'pdf' get full preview thumbnails & PDF downloads in Cloudinary.
    // DOCX/DOC are uploaded with .docx/.doc extension in public_id as raw files so they open directly in Word.
    const uploadOptions = isPdf
      ? {
          folder: 'cv_analyser_resumes',
          resource_type: 'image',
          format: 'pdf',
          public_id: `cv_${Date.now()}_${cleanBaseName}`,
        }
      : {
          folder: 'cv_analyser_resumes',
          resource_type: 'raw',
          public_id: `cv_${Date.now()}_${cleanBaseName}${ext}`,
        };

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        clearTimeout(timeoutTimer);
        if (hasResolved) return;
        hasResolved = true;

        if (error) {
          console.error('Cloudinary upload error:', error);
          return resolve({
            url: `https://storage.placeholder-resumes.internal/${Date.now()}_${originalname}`,
            publicId: `fallback_${Date.now()}`,
            simulated: true,
          });
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          resourceType: result.resource_type || (isPdf ? 'image' : 'raw'),
          simulated: false,
        });
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

/**
 * Deletes an asset from Cloudinary
 * @param {string} publicId
 * @param {string} resourceType
 * @returns {Promise<any>}
 */
const deleteFromCloudinary = async (publicId, resourceType = 'raw') => {
  if (!publicId || publicId.startsWith('local_') || publicId.startsWith('fallback_')) {
    return { result: 'skipped_local' };
  }

  ensureCloudinaryConfig();

  try {
    // Attempt 1: with passed resourceType (default 'raw' or 'image')
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    if (result && result.result === 'ok') return result;

    // Attempt 2: if not found, try the other resource type ('image' vs 'raw')
    const alternateType = resourceType === 'raw' ? 'image' : 'raw';
    const altResult = await cloudinary.uploader.destroy(publicId, {
      resource_type: alternateType,
    });
    return altResult;
  } catch (error) {
    console.error(`Failed to delete asset ${publicId} from Cloudinary:`, error);
    try {
      return await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
    } catch (_) {
      return { result: 'error', error: error.message };
    }
  }
};

module.exports = {
  cloudinary,
  isCloudinaryConfigured,
  uploadBufferToCloudinary,
  deleteFromCloudinary,
};
