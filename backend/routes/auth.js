const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// Generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }],
        });
        if (existingUser) {
            return res.status(400).json({
                message: existingUser.email === email
                    ? 'Bu e-posta adresi zaten kullanılıyor'
                    : 'Bu kullanıcı adı zaten kullanılıyor',
            });
        }

        const user = new User({ username, email, password });
        await user.save();

        const token = generateToken(user);
        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                bio: user.bio,
                avatar: user.avatar,
            },
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Geçersiz e-posta veya parola' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Geçersiz e-posta veya parola' });
        }

        const token = generateToken(user);
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                bio: user.bio,
                avatar: user.avatar,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
    res.json({
        user: {
            id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            role: req.user.role,
            bio: req.user.bio,
            avatar: req.user.avatar,
            createdAt: req.user.createdAt,
        },
    });
});

// PUT /api/auth/me
router.put('/me', auth, async (req, res) => {
    try {
        const { username, bio, avatar, password } = req.body;
        const updates = {};

        if (username) {
            const existing = await User.findOne({ username, _id: { $ne: req.user._id } });
            if (existing) {
                return res.status(400).json({ message: 'Bu kullanıcı adı zaten kullanılıyor' });
            }
            updates.username = username;
        }
        if (bio !== undefined) updates.bio = bio;
        if (avatar !== undefined) updates.avatar = avatar;

        // If password is being changed, we need to use save() for the pre-save hook
        if (password) {
            const user = await User.findById(req.user._id).select('+password');
            Object.assign(user, updates);
            user.password = password;
            await user.save();
            return res.json({
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    bio: user.bio,
                    avatar: user.avatar,
                },
            });
        }

        const user = await User.findByIdAndUpdate(req.user._id, updates, {
            new: true,
            runValidators: true,
        });

        res.json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                bio: user.bio,
                avatar: user.avatar,
            },
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

module.exports = router;
