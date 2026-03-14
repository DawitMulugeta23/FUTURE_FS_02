// backend/src/models/CalendarEvent.js
const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    leadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lead'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    allDay: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        enum: ['call', 'meeting', 'task', 'followup', 'other'],
        default: 'meeting'
    },
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
        default: 'scheduled'
    },
    reminders: [{
        time: Date,
        sent: { type: Boolean, default: false }
    }],
    attendees: [{
        email: String,
        name: String,
        status: { type: String, enum: ['pending', 'accepted', 'declined'] }
    }],
    location: String,
    meetingLink: String,
    notes: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);