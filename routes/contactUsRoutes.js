const express = require('express');
const router = express.Router();
const visitController = require('../controllers/contactUsController');
const { protect } = require('../middleware/authMiddleware');

router.post('/contact-us/create', visitController.createContactUs);
router.get('/contact-us/get', protect, visitController.getContactUs);
// router.get('/contact-us/:id', protect, visitController.getVisitById);

module.exports = router;
