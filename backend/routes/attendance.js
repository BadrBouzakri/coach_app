const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const { protect } = require('../middleware/auth');

// Get attendance for a specific event
router.get('/:eventId', protect, async (req, res) => {
    try {
        const attendance = await Attendance.find({ eventId: req.params.eventId }).populate('playerId', 'name position');
        res.json(attendance);
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Update attendance (Bulk or Single)
router.post('/', protect, async (req, res) => {
    try {
        const { eventId, attendanceData } = req.body; // attendanceData is array of { playerId, status, reason }

        // Use bulkWrite for efficiency
        const operations = attendanceData.map(record => ({
            updateOne: {
                filter: { eventId: eventId, playerId: record.playerId },
                update: { $set: { status: record.status, reason: record.reason } },
                upsert: true
            }
        }));

        await Attendance.bulkWrite(operations);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur mise à jour présence' });
    }
});

module.exports = router;
