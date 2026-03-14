// backend/src/models/EmailTemplate.js
const mongoose = require('mongoose');

const emailTemplateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    subject: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['welcome', 'followup', 'proposal', 'reminder', 'thankyou', 'newsletter'],
        default: 'followup'
    },
    variables: [String],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    usageCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('EmailTemplate', emailTemplateSchema);