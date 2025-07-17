const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    personalDetails: {
        firstName: { type: String, required: true },
        middleName: { type: String },
        lastName: { type: String, required: true },
        gender: { type: String, required: true },
        dob: { type: Date, required: true },
        address: { type: String, required: true },
        gradeLevel: { type: String, required: true }
    },
    fatherDetails: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true, minlength: 10 },
        occupation: { type: String, required: true }
    },
    motherDetails: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true, minlength: 10 },
        occupation: { type: String, required: true }
    },
    guardianDetails: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true, minlength: 10 }
    }
}, { timeStamps: true });
module.exports = mongoose.model('Student', studentSchema);