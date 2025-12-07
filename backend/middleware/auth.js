const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({ success: false, error: 'Non autorisé, pas de token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'wattrelos_fc_secret_key_2025');
        req.user = await User.findById(decoded.id);
        next();
    } catch (err) {
        return res.status(401).json({ success: false, error: 'Non autorisé, token invalide' });
    }
};

module.exports = { protect };
