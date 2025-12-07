const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Le nom est requis']
    },
    position: {
        type: String,
        enum: ['Gardien', 'Défenseur', 'Milieu', 'Attaquant'],
        required: true
    },
    jerseyNumber: {
        type: Number
    },
    dateOfBirth: {
        type: Date
    },
    parentContact: {
        email: String,
        phone: String
    },
    stats: {
        matchesPlayed: { type: Number, default: 0 },
        goals: { type: Number, default: 0 },
        assists: { type: Number, default: 0 },
        yellowCards: { type: Number, default: 0 },
        redCards: { type: Number, default: 0 }
    },
    photo: {
        type: String // URL to photo if we add upload later
    }
}, { timestamps: true });

module.exports = mongoose.model('Player', PlayerSchema);
