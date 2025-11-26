const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'wattrelos_fc_secret_key_2025';

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, password, role, team } = req.body;

        // Check if user exists
        let user = await User.findOne({ name });
        if (user) {
            return res.status(400).json({ success: false, error: "Ce nom d'utilisateur existe déjà" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        user = new User({
            name,
            password: hashedPassword,
            role,
            team,
            favorites: []
        });

        await user.save();

        // Create token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                role: user.role,
                team: user.team,
                favorites: user.favorites
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Erreur serveur' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { name, password } = req.body;

        // Check user
        const user = await User.findOne({ name });
        if (!user) {
            return res.status(400).json({ success: false, error: 'Identifiants incorrects' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, error: 'Identifiants incorrects' });
        }

        // Create token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                role: user.role,
                team: user.team,
                favorites: user.favorites
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Erreur serveur' });
    }
});

// Update Favorites
router.post('/favorites', async (req, res) => {
    try {
        const { userId, favorites } = req.body;
        await User.findByIdAndUpdate(userId, { favorites });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Erreur mise à jour favoris' });
    }
});

module.exports = router;
