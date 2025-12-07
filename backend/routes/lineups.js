const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Lineup = require('../models/Lineup');

// @desc    Get all lineups
// @route   GET /api/lineups
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const lineups = await Lineup.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: lineups.length, data: lineups });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Get single lineup
// @route   GET /api/lineups/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const lineup = await Lineup.findById(req.params.id);

        if (!lineup) {
            return res.status(404).json({ success: false, error: 'Lineup not found' });
        }

        if (lineup.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        res.status(200).json({ success: true, data: lineup });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Create new lineup
// @route   POST /api/lineups
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        req.body.user = req.user.id;
        const lineup = await Lineup.create(req.body);
        res.status(201).json({ success: true, data: lineup });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc    Update lineup
// @route   PUT /api/lineups/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        let lineup = await Lineup.findById(req.params.id);

        if (!lineup) {
            return res.status(404).json({ success: false, error: 'Lineup not found' });
        }

        if (lineup.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        lineup = await Lineup.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: lineup });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc    Delete lineup
// @route   DELETE /api/lineups/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const lineup = await Lineup.findById(req.params.id);

        if (!lineup) {
            return res.status(404).json({ success: false, error: 'Lineup not found' });
        }

        if (lineup.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        await lineup.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

module.exports = router;
