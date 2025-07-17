
const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');

const updateSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['News', 'Events', 'Announcements'],
        required: true
    },
    image: {
        type: String
    },
    publishDate: {
        type: Date,
        default: Date.now
    }
},
    {
        timestamps: true
    });

module.exports = mongoose.model('Update', updateSchema);