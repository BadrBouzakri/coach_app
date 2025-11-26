const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'Coach' },
    team: { type: String, default: 'U11' },
    favorites: [{ type: String }], // Array of exercise IDs
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
