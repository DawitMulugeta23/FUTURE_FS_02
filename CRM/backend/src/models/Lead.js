// backend/models/Lead.js
const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'Please add note content']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const leadSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please add first name'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Please add last name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please add email'],
        lowercase: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    phone: {
        type: String,
        trim: true
    },
    company: {
        type: String,
        trim: true
    },
    source: {
        type: String,
        enum: ['website', 'referral', 'social_media', 'email_campaign', 'advertisement', 'other'],
        default: 'website'
    },
    status: {
        type: String,
        enum: ['new', 'contacted', 'qualified', 'converted', 'lost'],
        default: 'new'
    },
    notes: [noteSchema],
    convertedAt: {
        type: Date
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Update convertedAt when status changes to converted
leadSchema.pre('save', function(next) {
    if (this.isModified('status') && this.status === 'converted' && !this.convertedAt) {
        this.convertedAt = Date.now();
    }
    next();
});

module.exports = mongoose.model('Lead', leadSchema);