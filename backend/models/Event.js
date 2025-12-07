const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['Entraînement', 'Match', 'Réunion', 'Autre'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String, // HH:mm
        required: true
    },
    duration: {
        type: Number, // in minutes
        default: 90
    },
    location: {
        type: String,
        default: 'Stade'
    },
    opponent: {
        type: String // Only for matches
    },
    notes: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
