const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Video = require('../models/Video');

// @desc    Get all videos for user
// @route   GET /api/videos
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const videos = await Video.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(videos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// @desc    Add a video
// @route   POST /api/videos
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { title, url, category, description } = req.body;

        if (!title || !url) {
            return res.status(400).json({ error: 'Titre et URL requis' });
        }

        const video = new Video({
            user: req.user.id,
            title,
            url,
            category: category || 'Autre',
            description: description || ''
        });

        await video.save();
        res.status(201).json(video);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur création vidéo' });
    }
});

// @desc    Delete a video
// @route   DELETE /api/videos/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);

        if (!video) {
            return res.status(404).json({ error: 'Vidéo non trouvée' });
        }

        if (video.user.toString() !== req.user.id) {
            return res.status(401).json({ error: 'Non autorisé' });
        }

        await video.deleteOne();
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur suppression' });
    }
});

module.exports = router;
