
const express = require('express');
const testimonialController = require('../controllers/testimonialController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
const multer = require("multer");
const path = require("path");
// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Store resumes in 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });
router.get('/testimonials/active', testimonialController.getActiveTestimonials);

router.get('/testimonials', protect, testimonialController.getTestimonials);

router.post('/testimonials', protect, upload.single('image'), testimonialController.createTestimonial);

router.put('/testimonials/:id', protect, testimonialController.toggleTestimonialStatus);

router.patch('/testimonials/:id', protect, testimonialController.updateTestimonialStatus);
module.exports = router;
