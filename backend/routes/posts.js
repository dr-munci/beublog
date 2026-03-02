const express = require('express');
const Post = require('../models/Post');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/posts — Public (only approved posts)
router.get('/', async (req, res) => {
    try {
        const { category, search, page = 1, limit = 12, sort = 'newest' } = req.query;
        const query = { status: 'approved' };

        if (category) query.category = category;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } },
            ];
        }

        const sortOptions = {
            newest: { createdAt: -1 },
            oldest: { createdAt: 1 },
            popular: { viewCount: -1 },
            liked: { likes: -1 },
        };

        const total = await Post.countDocuments(query);
        const posts = await Post.find(query)
            .populate('author', 'username avatar')
            .populate('category', 'name slug')
            .sort(sortOptions[sort] || sortOptions.newest)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .select('-content');

        res.json({
            posts,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total,
        });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

// GET /api/posts/my — User's own posts (all statuses)
router.get('/my', auth, async (req, res) => {
    try {
        const posts = await Post.find({ author: req.user._id })
            .populate('category', 'name slug')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

// GET /api/posts/admin/all — Admin: all posts
router.get('/admin/all', auth, isAdmin, async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const query = {};
        if (status) query.status = status;

        const total = await Post.countDocuments(query);
        const posts = await Post.find(query)
            .populate('author', 'username avatar')
            .populate('category', 'name slug')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.json({
            posts,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total,
        });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

// GET /api/posts/:id — Public (single post)
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'username avatar bio')
            .populate('category', 'name slug');

        if (!post) {
            return res.status(404).json({ message: 'Yazı bulunamadı' });
        }

        // Increment view count
        post.viewCount += 1;
        await post.save();

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

// POST /api/posts — Create post (authenticated)
router.post('/', auth, async (req, res) => {
    try {
        const { title, content, summary, category, coverImage, tags } = req.body;

        const post = new Post({
            title,
            content,
            summary,
            category,
            coverImage,
            tags: tags || [],
            author: req.user._id,
            status: req.user.role === 'admin' ? 'approved' : 'pending',
        });

        await post.save();
        await post.populate('author', 'username avatar');
        await post.populate('category', 'name slug');

        res.status(201).json(post);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

// PUT /api/posts/:id — Update post (author or admin)
router.put('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Yazı bulunamadı' });
        }

        // Check ownership
        if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bu yazıyı düzenleme yetkiniz yok' });
        }

        const { title, content, summary, category, coverImage, tags } = req.body;
        if (title) post.title = title;
        if (content) post.content = content;
        if (summary !== undefined) post.summary = summary;
        if (category) post.category = category;
        if (coverImage !== undefined) post.coverImage = coverImage;
        if (tags) post.tags = tags;

        // If regular user edits, reset to pending
        if (req.user.role !== 'admin') {
            post.status = 'pending';
        }

        await post.save();
        await post.populate('author', 'username avatar');
        await post.populate('category', 'name slug');

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

// DELETE /api/posts/:id — Delete post (author or admin)
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Yazı bulunamadı' });
        }

        if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bu yazıyı silme yetkiniz yok' });
        }

        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: 'Yazı silindi' });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

// PUT /api/posts/:id/like — Toggle like
router.put('/:id/like', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Yazı bulunamadı' });
        }

        const userId = req.user._id;
        const likeIndex = post.likes.indexOf(userId);

        if (likeIndex === -1) {
            post.likes.push(userId);
        } else {
            post.likes.splice(likeIndex, 1);
        }

        await post.save();
        res.json({ likes: post.likes, likeCount: post.likes.length });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

// PUT /api/posts/:id/moderate — Admin: approve or suspend
router.put('/:id/moderate', auth, isAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        if (!['approved', 'suspended'].includes(status)) {
            return res.status(400).json({ message: 'Geçersiz durum. approved veya suspended olmalı' });
        }

        const post = await Post.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        )
            .populate('author', 'username avatar')
            .populate('category', 'name slug');

        if (!post) {
            return res.status(404).json({ message: 'Yazı bulunamadı' });
        }

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

module.exports = router;
