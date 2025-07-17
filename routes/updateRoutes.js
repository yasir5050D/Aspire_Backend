const express = require('express');
const router = express.Router();
const updateController = require('../controllers/updateController');

router.post('/updates', updateController.createUpdate);         // Create new update (Admin)
router.get('/updates', updateController.getUpdates);            // View all updates/news
router.put('/updates/:id', updateController.updateUpdate);      // Update an update/news (Admin)
router.delete('/updates/:id', updateController.deleteUpdate);   // Delete an update/news (Admin)

module.exports = router;
