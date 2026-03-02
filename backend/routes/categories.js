const express = require('express');
const Category = require('../models/Category');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/categories — Public
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

// GET /api/categories/:id — Public
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Kategori bulunamadı' });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

// POST /api/categories — Admin only
router.post('/', auth, isAdmin, async (req, res) => {
    try {
        const { name, description } = req.body;
        const category = new Category({ name, description });
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Bu kategori adı zaten mevcut' });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

// PUT /api/categories/:id — Admin only
router.put('/:id', auth, isAdmin, async (req, res) => {
    try {
        const { name, description } = req.body;
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Kategori bulunamadı' });
        }

        if (name) category.name = name;
        if (description !== undefined) category.description = description;
        await category.save();

        res.json(category);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Bu kategori adı zaten mevcut' });
        }
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

// DELETE /api/categories/:id — Admin only
router.delete('/:id', auth, isAdmin, async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Kategori bulunamadı' });
        }
        res.json({ message: 'Kategori silindi' });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

module.exports = router;
