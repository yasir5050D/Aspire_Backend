const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'testimonials',
        allowed_formats: ['jpg', 'png', 'jpeg'],
        transformation: [
            { width: 800, height: 600, crop: "limit" }, // Resize to 800x600 max
            { quality: "auto:eco" }, // Optimize quality
            { fetch_format: "auto" } // Convert to WebP, JPEG, etc.
        ]
    },
});

const upload = multer({ storage });

module.exports = upload;
