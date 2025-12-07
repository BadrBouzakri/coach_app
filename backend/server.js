const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

dotenv.config();

const app = express();

// Security Middleware
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100
});
app.use('/api', limiter);

// Standard Middleware
app.use(cors({
    origin: 'http://localhost:8080', // Adjust for production
    credentials: true
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://mongo:27017/coach_app')
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
