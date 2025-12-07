const express = require('express');
const router = express.Router();
const Player = require('../models/Player');
const { protect } = require('../middleware/auth');

// Get all players for the logged-in user
router.get('/', protect, async (req, res) => {
    try {
        const players = await Player.find({ userId: req.user.id }).sort({ name: 1 });
        res.json(players);
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Create a player
router.post('/', protect, async (req, res) => {
    try {
        console.log("Creating player with body:", req.body);
        const newPlayer = new Player({
            ...req.body,
            userId: req.user.id
        });
        const savedPlayer = await newPlayer.save();
        res.json(savedPlayer);
    } catch (err) {
        res.status(500).json({ error: 'Erreur création joueur' });
    }
});

// Update a player
router.put('/:id', protect, async (req, res) => {
    try {
        const updatedPlayer = await Player.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            req.body,
            { new: true }
        );
        if (!updatedPlayer) {
            return res.status(404).json({ error: 'Joueur non trouvé' });
        }
        res.json(updatedPlayer);
    } catch (err) {
        res.status(500).json({ error: 'Erreur modification joueur' });
    }
});

// Delete a player
router.delete('/:id', protect, async (req, res) => {
    try {
        const deletedPlayer = await Player.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!deletedPlayer) {
            return res.status(404).json({ error: 'Joueur non trouvé' });
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Erreur suppression joueur' });
    }
});

module.exports = router;
