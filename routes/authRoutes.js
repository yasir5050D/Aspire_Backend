
const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/auth/login', authController.loginAdmin);
router.post('/auth/create-admin', authController.createAdmin);  // Call once to create initial admin

module.exports = router;
