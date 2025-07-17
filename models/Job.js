
const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');

const jobSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    requirements: [{
        type: String
    }],
    type: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Contract'],
        required: true
    },
    status: {
        type: String,
        enum: ['Open', 'Closed'],
        default: 'Open'
    },
},
    {
        timestamps: true
    });

module.exports = mongoose.model('Job', jobSchema);