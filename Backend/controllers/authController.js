const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const rateLimit = require('express-rate-limit');

// Rate Limiting
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per `windowMs`
    message: 'Too many login attempts. Please try again later.',
});

// Google OAuth Client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// POST: User Login
const googleLogin = async (req, res) => {
    const { tokenId } = req.body;

    if (!tokenId) return res.status(400).json({ error: 'Google token is required.' });

    try {
        // Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { email, name } = ticket.getPayload();

        // Find or create user
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ email, name });
            await user.save();
        }

        // Generate JWT
        const token = jwt.sign({ userId: user._id, email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, message: 'Login successful.' });
    } catch (err) {
        res.status(500).json({ error: 'Authentication failed.' });
    }
};

module.exports = {
    googleLogin,
    loginLimiter,
};
