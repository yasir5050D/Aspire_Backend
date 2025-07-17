const express = require('express');
const router = express.Router();
const visitController = require('../controllers/visitController');
const { protect } = require('../middleware/authMiddleware');

router.post('/visits', visitController.createVisit);
router.get('/visits', protect, visitController.getVisits);
router.get('/visits/:id', protect, visitController.getVisitById);

module.exports = router;
