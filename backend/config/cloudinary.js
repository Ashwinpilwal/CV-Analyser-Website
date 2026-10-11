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
 * Uploads a file buffer to Cloudinary or returns fallback mock URL
 * @param {Buffer} buffer 
 * @param {string} originalname 
 * @param {string} mimetype 
 * @returns {Promise<{ url: string, publicId: string }>}
 */
const uploadBufferToCloudinary = (buffer, originalname = 'resume.pdf', mimetype = 'application/pdf') => {
  return new Promise((resolve, reject) => {
    if (!ensureCloudinaryConfig()) {
      // Graceful fallback for local dev without active Cloudinary account
      const safeName = originalname ? originalname.replace(/[^a-zA-Z0-9._-]/g, '_') : 'resume.pdf';
      return resolve({
        url: `https://storage.placeholder-resumes.internal/${Date.now()}_${safeName}`,
        publicId: `local_${Date.now()}`,
        simulated: true,
      });
    }

    const cleanBaseName = (originalname || 'resume')
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_');

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'cv_analyser_resumes',
        resource_type: 'raw',
        public_id: `cv_${Date.now()}_${cleanBaseName}`,
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          // Return simulated fallback instead of failing the user experience
          return resolve({
            url: `https://storage.placeholder-resumes.internal/${Date.now()}_${originalname}`,
            publicId: `fallback_${Date.now()}`,
            simulated: true,
          });
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
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
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    console.error(`Failed to delete asset ${publicId} from Cloudinary:`, error);
    // Try image resource type as fallback just in case
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
