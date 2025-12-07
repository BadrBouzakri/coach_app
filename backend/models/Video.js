const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Le titre est requis'],
        trim: true
    },
    url: {
        type: String,
        required: [true, 'L\'URL est requise']
    },
    category: {
        type: String,
        enum: ['Technique', 'Tactique', 'Physique', 'Mental', 'Gardien', 'Autre'],
        default: 'Autre'
    },
    description: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Video', VideoSchema);
