// backend/src/models/Activity.js
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    leadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lead',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['note', 'email', 'call', 'meeting', 'task', 'status_change', 'score_change', 'file_upload', 'voice_note'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    metadata: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    },
    duration: Number, // in minutes
    outcome: {
        type: String,
        enum: ['positive', 'neutral', 'negative', 'pending']
    },
    attachments: [{
        name: String,
        url: String,
        type: String,
        size: Number
    }],
    location: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Activity', activitySchema);