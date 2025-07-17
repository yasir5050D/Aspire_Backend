const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    middleName: {
        type: String,
    },
    lastName: {
        type: String,
        required: true
    },
    gradeLevel: {
        type: String,
        required: true
    },
    visitingHours: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Visit', visitSchema);

