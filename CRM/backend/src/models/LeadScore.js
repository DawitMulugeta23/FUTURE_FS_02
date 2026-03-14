// backend/src/models/LeadScore.js
const mongoose = require('mongoose');

const leadScoreSchema = new mongoose.Schema({
    leadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lead',
        required: true
    },
    score: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    grade: {
        type: String,
        enum: ['A', 'B', 'C', 'D', 'F'],
        default: 'C'
    },
    factors: {
        emailOpenRate: { type: Number, default: 0 },
        websiteVisits: { type: Number, default: 0 },
        socialEngagement: { type: Number, default: 0 },
        responseTime: { type: Number, default: 0 },
        meetingAttendance: { type: Number, default: 0 },
        budget: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
        timeline: { type: String, enum: ['immediate', 'short', 'medium', 'long'], default: 'medium' }
    },
    recommendations: [String],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('LeadScore', leadScoreSchema);