const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
router.post('/students', studentController.registerStudent);         // Register new student
router.get('/students', protect, studentController.getStudents);              // Get all students (Admin)
router.put('/students/:id', protect, studentController.updateStudent);        // Update student data (Admin)
router.delete('/students/:id', protect, studentController.deleteStudent);     // Delete student record (Admin)

module.exports = router;
