const mongoose = require('mongoose');

const LineupSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please add a lineup name'],
        trim: true
    },
    formation: {
        type: String,
        default: '4-3-3'
    },
    players: [{
        player: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Player'
        },
        position: {
            x: Number, // Percentage 0-100
            y: Number  // Percentage 0-100
        },
        jerseyNumber: Number,
        name: String
    }],
    items: [{
        type: {
            type: String,
            enum: ['cone', 'flag', 'ball', 'goal', 'ladder', 'mannequin', 'hoop'],
            required: true
        },
        position: {
            x: Number,
            y: Number
        }
    }],
    notes: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Lineup', LineupSchema);
