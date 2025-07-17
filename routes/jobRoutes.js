const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

const { protect } = require('../middleware/authMiddleware');

router.post('/jobs', protect, jobController.createJob);         // Create new job (Admin)
router.get('/jobs', jobController.getJobs);            // View all jobs
router.put('/jobs/:id/status', protect, jobController.updateJob);      // Update job (Admin)
router.delete('/jobs/:id', protect, jobController.deleteJob);   // Delete job (Admin)

module.exports = router;
