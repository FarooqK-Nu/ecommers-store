const cloudinary = require('cloudinary').v2;

// Configure Cloudinary credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME || 'mock-cloud-name',
  api_key: process.env.CLOUDINARY_KEY || 'mock-api-key',
  api_secret: process.env.CLOUDINARY_SECRET || 'mock-api-secret'
});

module.exports = cloudinary;
