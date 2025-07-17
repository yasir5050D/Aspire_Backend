
const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');

const applicationSchema = mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    resume: {
        type: String,
        required: true
    },
    coverLetter: {
        type: String
    },
    status: {
        type: String,
        enum: ['Pending', 'Reviewed', 'Shortlisted', 'Rejected'],
        default: 'Pending'
    },
    appliedAt: {
        type: Date,
        default: Date.now
    }
},
    {
        timestamps: true
    });

module.exports = mongoose.model('Application', applicationSchema);