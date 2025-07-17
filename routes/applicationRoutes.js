const express = require('express');
const router = express.Router();
const multer = require("multer");
const path = require("path");
const applicationController = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
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

router.post('/applications', upload.single("resume"), applicationController.createApplication);// Submit application
router.get('/applications', protect, applicationController.getApplications);            // View all applications (Admin)
router.delete('/applications/:id', protect, applicationController.deleteApplication);   // Delete application (Admin)
router.put('/applications/:id', protect, applicationController.updateApplicationStatus);// Update application status(Admin)
router.get('/applications/download-resume/:fileName', protect, applicationController.downloadResume);
module.exports = router;
