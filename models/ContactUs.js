const mongoose = require('mongoose');
const contactSchema = new mongoose.Schema({
    contactEmail: {
        type: String,
        required: true
    },
    contactName: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    contactMessage: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);

