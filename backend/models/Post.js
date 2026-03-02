const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Başlık zorunludur'],
            trim: true,
            maxlength: [200, 'Başlık en fazla 200 karakter olmalıdır'],
        },
        content: {
            type: String,
            required: [true, 'İçerik zorunludur'],
        },
        summary: {
            type: String,
            maxlength: [500, 'Özet en fazla 500 karakter olmalıdır'],
            default: '',
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Kategori zorunludur'],
        },
        coverImage: {
            type: String,
            default: '',
        },
        tags: [
            {
                type: String,
                trim: true,
            },
        ],
        status: {
            type: String,
            enum: ['pending', 'approved', 'suspended'],
            default: 'pending',
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        viewCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Virtual for like count
postSchema.virtual('likeCount').get(function () {
    return this.likes.length;
});

// Ensure virtuals are included in JSON
postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });

// Index for search
postSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Post', postSchema);
