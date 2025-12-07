const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

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

        // Send token in cookie
        const options = {
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        };

        res.status(200)
            .cookie('token', token, options)
            .json({
                success: true,
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

        // Send token in cookie
        const options = {
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        };

        res.status(200)
            .cookie('token', token, options)
            .json({
                success: true,
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
router.post('/favorites', protect, async (req, res) => {
    try {
        const { userId, favorites } = req.body;
        await User.findByIdAndUpdate(userId, { favorites });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Erreur mise à jour favoris' });
    }
});

// Logout
router.get('/logout', (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ success: true, data: {} });
});

module.exports = router;
