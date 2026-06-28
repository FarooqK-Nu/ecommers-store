import multer from 'multer';
import ApiError from '../utils/ApiError.js';

// Configure multer storage in memory (buffers) to feed into Cloudinary stream
const multerStorage = multer.memoryStorage();

// Strict mime-type filter to only allow image uploads
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new ApiError('Not an image! Please upload only image files.', 400), false);
  }
};

// Set limits and configuration
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Handler for parsing up to 5 images on a request
export const uploadProductImages = upload.array('images', 5);
