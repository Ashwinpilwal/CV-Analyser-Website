const multer = require('multer');
const path = require('path');

// Store files in memory so we can extract text & stream to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf', '.docx', '.doc', '.txt'];
  const ext = path.extname(file.originalname).toLowerCase();

  const allowedMimeTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/plain',
  ];

  if (allowedExtensions.includes(ext) || allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Unsupported file type (${ext || file.mimetype}). Please upload a PDF, DOCX, DOC, or TXT document.`
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB maximum limit
  },
  fileFilter,
});

module.exports = upload;
