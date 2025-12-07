const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    playerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true
    },
    status: {
        type: String,
        enum: ['Présent', 'Absent', 'Excusé', 'Retard', 'Blessé'],
        default: 'Présent'
    },
    reason: {
        type: String // Reason for absence/late
    }
}, { timestamps: true });

// Compound index to ensure one attendance record per player per event
AttendanceSchema.index({ eventId: 1, playerId: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
