const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please add a session title'],
        trim: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    duration: {
        type: Number, // in minutes
        required: true
    },
    objectives: [{
        type: String
    }],
    exercises: [{
        exercise: {
            type: String, // ID of the exercise from JSON/DB
            required: true
        },
        title: String,
        duration: Number, // in minutes
        order: Number,
        notes: String
    }],
    playersPresent: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    }],
    weather: {
        type: String,
        enum: ['Ensoleillé', 'Nuageux', 'Pluvieux', 'Très chaud', 'Froid', 'Indoor'],
        default: 'Ensoleillé'
    },
    fieldType: {
        type: String,
        enum: ['Herbe naturelle', 'Synthétique', 'Salle/Gymnase', 'Stabilisé'],
        default: 'Herbe naturelle'
    },
    notes: {
        type: String
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Session', SessionSchema);
