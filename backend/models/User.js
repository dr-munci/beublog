const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Kullanıcı adı zorunludur'],
            unique: true,
            trim: true,
            minlength: [3, 'Kullanıcı adı en az 3 karakter olmalıdır'],
            maxlength: [30, 'Kullanıcı adı en fazla 30 karakter olmalıdır'],
        },
        email: {
            type: String,
            required: [true, 'E-posta zorunludur'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Geçerli bir e-posta adresi giriniz'],
        },
        password: {
            type: String,
            required: [true, 'Parola zorunludur'],
            minlength: [6, 'Parola en az 6 karakter olmalıdır'],
            select: false,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        bio: {
            type: String,
            maxlength: [500, 'Bio en fazla 500 karakter olmalıdır'],
            default: '',
        },
        avatar: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
