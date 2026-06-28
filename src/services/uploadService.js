const cloudinary = require('../config/cloudinary');

/**
 * Upload a raw buffer to Cloudinary using its uploader stream.
 * Offers automatic compression, format optimization, and scaling.
 * @param {Buffer} buffer - The file buffer.
 * @param {string} folder - The destination folder in Cloudinary.
 * @returns {Promise<string>} - Resolves with the secure upload URL.
 */
exports.uploadBuffer = (buffer, folder = 'shopsphere/products') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { //options object
        folder,
        resource_type: 'image',
        transformation: [
          { width: 800, height: 800, crop: 'limit' }, // Constrain images to max 800x800
          { quality: 'auto', fetch_format: 'auto' }     // Automatically optimize compression and format
        ]
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result.secure_url);
      }
    );

    uploadStream.end(buffer);
  });
};
