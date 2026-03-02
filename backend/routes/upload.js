const express = require('express');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// POST /api/upload — Upload single image
router.post('/', auth, (req, res) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: 'Dosya boyutu 10MB\'ı aşamaz' });
            }
            return res.status(400).json({ message: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Dosya yüklenmedi' });
        }

        const url = `/uploads/${req.file.filename}`;
        res.json({ url, filename: req.file.filename });
    });
});

module.exports = router;
