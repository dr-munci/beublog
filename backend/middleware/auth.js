const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'beublog-default-secret-key';

// Verify JWT token
const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Yetkilendirme token\'ı gerekli' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'Kullanıcı bulunamadı' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Geçersiz token' });
    }
};

// Check admin role
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Bu işlem için yetkiniz yok' });
    }
    next();
};

module.exports = { auth, isAdmin, JWT_SECRET };
