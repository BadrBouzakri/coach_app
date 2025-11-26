const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: String }, // Formatted date string for display
    timestamp: { type: Number, default: Date.now }
});

module.exports = mongoose.model('Note', NoteSchema);
