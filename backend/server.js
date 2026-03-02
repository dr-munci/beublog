const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files - uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/upload', require('./routes/upload'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Database status endpoint
app.get('/api/db-status', async (req, res) => {
    try {
        const Category = require('./models/Category');
        const User = require('./models/User');
        const Post = require('./models/Post');

        const categories = await Category.find().select('name slug description');
        const users = await User.find().select('username email role createdAt');
        const posts = await Post.find()
            .populate('author', 'username')
            .populate('category', 'name')
            .select('title status author category createdAt');

        res.json({
            status: 'connected',
            database: mongoose.connection.name,
            host: mongoose.connection.host,
            tables: {
                categories: {
                    count: categories.length,
                    data: categories
                },
                users: {
                    count: users.length,
                    data: users
                },
                posts: {
                    count: posts.length,
                    data: posts
                }
            }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

async function seedDefaultData() {
    const Category = require('./models/Category');
    const User = require('./models/User');

    // Seed categories
    const defaultCategories = [
        { name: 'Genel', description: 'Genel konular ve tartışmalar' },
        { name: 'Teknoloji', description: 'Yazılım, donanım ve teknoloji haberleri' },
        { name: 'Yaşam', description: 'Günlük yaşam, sağlık ve kişisel gelişim' },
        { name: 'Bilim', description: 'Bilimsel araştırmalar ve keşifler' },
        { name: 'Eğitim', description: 'Eğitim, öğretim ve akademik içerikler' }
    ];

    const catCount = await Category.countDocuments();
    if (catCount === 0) {
        for (const cat of defaultCategories) {
            try {
                await Category.create(cat);
                console.log(`✓ Kategori oluşturuldu: ${cat.name}`);
            } catch (err) {
                console.error(`✗ Kategori oluşturulamadı (${cat.name}):`, err.message);
            }
        }
    } else {
        console.log(`ℹ Mevcut kategori sayısı: ${catCount}`);
    }

    // Seed admin user
    const userCount = await User.countDocuments();
    if (userCount === 0) {
        try {
            await User.create({
                username: 'admin',
                email: 'admin@beublog.com',
                password: 'admin123',
                role: 'admin',
                bio: 'Sistem Yöneticisi'
            });
            console.log('✓ Admin kullanıcısı oluşturuldu: admin@beublog.com / admin123');
        } catch (err) {
            console.error('✗ Admin kullanıcısı oluşturulamadı:', err.message);
        }
    } else {
        console.log(`ℹ Mevcut kullanıcı sayısı: ${userCount}`);
    }
}

async function startServer() {
    try {
        if (!MONGO_URI) {
            console.log('⚠ MONGO_URI bulunamadı, mongodb-memory-server başlatılıyor...');
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongoServer = await MongoMemoryServer.create();
            const uri = mongoServer.getUri();
            await mongoose.connect(uri);
            console.log(`✓ In-memory MongoDB başlatıldı: ${uri}`);
        } else {
            await mongoose.connect(MONGO_URI);
            console.log(`✓ MongoDB bağlantısı başarılı: ${MONGO_URI}`);
        }

        // Wait for connection to be fully established
        await new Promise(resolve => setTimeout(resolve, 500));

        // Seed default data
        await seedDefaultData();

        app.listen(PORT, () => {
            console.log(`\n🚀 Server ${PORT} portunda çalışıyor`);
            console.log(`   Frontend: http://localhost:5173 veya http://localhost:5174`);
            console.log(`   API: http://localhost:${PORT}/api`);
            console.log(`   DB Status: http://localhost:${PORT}/api/db-status\n`);
        });
    } catch (err) {
        console.error('❌ Başlatma hatası:', err.message);
        process.exit(1);
    }
}

startServer();
