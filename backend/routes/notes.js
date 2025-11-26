const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// Get all notes for a user
router.get('/:userId', async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.params.userId }).sort({ timestamp: -1 });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Create a note
router.post('/', async (req, res) => {
    try {
        const newNote = new Note(req.body);
        const savedNote = await newNote.save();
        res.json(savedNote);
    } catch (err) {
        res.status(500).json({ error: 'Erreur création note' });
    }
});

// Update a note
router.put('/:id', async (req, res) => {
    try {
        const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedNote);
    } catch (err) {
        res.status(500).json({ error: 'Erreur modification note' });
    }
});

// Delete a note
router.delete('/:id', async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Erreur suppression note' });
    }
});

module.exports = router;
