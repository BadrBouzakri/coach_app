const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { protect } = require('../middleware/auth');

// Get all events for the logged-in user
router.get('/', protect, async (req, res) => {
    try {
        const events = await Event.find({ userId: req.user.id }).sort({ date: 1 });
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Create an event
router.post('/', protect, async (req, res) => {
    try {
        const newEvent = new Event({
            ...req.body,
            userId: req.user.id
        });
        const savedEvent = await newEvent.save();
        res.json(savedEvent);
    } catch (err) {
        res.status(500).json({ error: 'Erreur création événement' });
    }
});

// Update an event
router.put('/:id', protect, async (req, res) => {
    try {
        const updatedEvent = await Event.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            req.body,
            { new: true }
        );
        if (!updatedEvent) {
            return res.status(404).json({ error: 'Événement non trouvé' });
        }
        res.json(updatedEvent);
    } catch (err) {
        res.status(500).json({ error: 'Erreur modification événement' });
    }
});

// Delete an event
router.delete('/:id', protect, async (req, res) => {
    try {
        const deletedEvent = await Event.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!deletedEvent) {
            return res.status(404).json({ error: 'Événement non trouvé' });
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Erreur suppression événement' });
    }
});

module.exports = router;
