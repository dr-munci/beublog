import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
    User, Mail, Save, AlertCircle, CheckCircle, 
    FileText, Edit, Trash2, Eye, Clock, CheckCircle2, XCircle,
    Settings, BookOpen
} from 'lucide-react';
import api from '../services/api';

export default function Profile() {
    const { user, updateProfile } = useAuth();
    const [activeTab, setActiveTab] = useState('posts');
    const [username, setUsername] = useState(user?.username || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [avatar, setAvatar] = useState(user?.avatar || '');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    
    const [myPosts, setMyPosts] = useState([]);
    const [postsLoading, setPostsLoading] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const API_URL = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

    useEffect(() => {
        fetchMyPosts();
    }, []);

    const fetchMyPosts = async () => {
        try {
            setPostsLoading(true);
            const res = await api.get('/posts/my');
            setMyPosts(res.data);
        } catch (err) {
            console.error('Yazılar yüklenemedi:', err);
        } finally {
            setPostsLoading(false);
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            await api.delete(`/posts/${postId}`);
            setMyPosts(myPosts.filter(p => p._id !== postId));
            setDeleteConfirm(null);
            setSuccess('Yazı silindi');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Silme başarısız');
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return <span className="status-badge approved"><CheckCircle2 size={14} /> Onaylı</span>;
            case 'pending':
                return <span className="status-badge pending"><Clock size={14} /> Beklemede</span>;
            case 'suspended':
                return <span className="status-badge suspended"><XCircle size={14} /> Askıda</span>;
            default:
                return null;
        }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setUploading(true);
        try {
            const res = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setAvatar(res.data.url);
        } catch (err) {
            setError('Avatar yüklenemedi');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const data = { username, bio, avatar };
            if (password) data.password = password;
            await updateProfile(data);
            setSuccess('Profil güncellendi');
            setPassword('');
        } catch (err) {
            setError(err.response?.data?.message || 'Güncelleme başarısız');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-page">
            <div className="container">
                {error && (
                    <div className="alert alert-error">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className="alert alert-success">
                        <CheckCircle size={18} />
                        <span>{success}</span>
                    </div>
                )}

                <div className="profile-header">
                    <div className="profile-info">
                        <div className="avatar-lg">
                            {avatar ? (
                                <img
                                    src={avatar.startsWith('http') ? avatar : `${API_URL}${avatar}`}
                                    alt="Avatar"
                                />
                            ) : (
                                user?.username?.[0]?.toUpperCase() || '?'
                            )}
                        </div>
                        <div className="profile-details">
                            <h1>{user?.username}</h1>
                            <p className="email">{user?.email}</p>
                            {user?.bio && <p className="bio">{user.bio}</p>}
                        </div>
                    </div>
                </div>

                <div className="profile-tabs">
                    <button 
                        className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
                        onClick={() => setActiveTab('posts')}
                    >
                        <BookOpen size={18} />
                        Yazılarım ({myPosts.length})
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        <Settings size={18} />
                        Ayarlar
                    </button>
                </div>

                {activeTab === 'posts' && (
                    <div className="my-posts-section">
                        <div className="section-header">
                            <h2><FileText size={22} /> Yazılarım</h2>
                            <Link to="/yazi-olustur" className="btn btn-primary btn-sm">
                                + Yeni Yazı
                            </Link>
                        </div>

                        {postsLoading ? (
                            <div className="loading-state">Yazılar yükleniyor...</div>
                        ) : myPosts.length === 0 ? (
                            <div className="empty-state">
                                <FileText size={48} />
                                <h3>Henüz yazınız yok</h3>
                                <p>İlk yazınızı oluşturmak için butona tıklayın.</p>
                                <Link to="/yazi-olustur" className="btn btn-primary">
                                    Yazı Oluştur
                                </Link>
                            </div>
                        ) : (
                            <div className="posts-list">
                                {myPosts.map(post => (
                                    <div key={post._id} className="post-item">
                                        <div className="post-item-content">
                                            <div className="post-item-header">
                                                <Link to={`/yazi/${post._id}`} className="post-title">
                                                    {post.title}
                                                </Link>
                                                {getStatusBadge(post.status)}
                                            </div>
                                            <div className="post-meta">
                                                <span className="category">{post.category?.name || 'Kategori yok'}</span>
                                                <span className="date">{formatDate(post.createdAt)}</span>
                                                <span className="views"><Eye size={14} /> {post.viewCount || 0}</span>
                                                <span className="likes">❤️ {post.likes?.length || 0}</span>
                                            </div>
                                            {post.summary && <p className="post-summary">{post.summary}</p>}
                                        </div>
                                        <div className="post-item-actions">
                                            <Link 
                                                to={`/yazi-duzenle/${post._id}`} 
                                                className="btn btn-outline btn-sm"
                                                title="Düzenle"
                                            >
                                                <Edit size={16} />
                                            </Link>
                                            {deleteConfirm === post._id ? (
                                                <div className="delete-confirm">
                                                    <button 
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => handleDeletePost(post._id)}
                                                    >
                                                        Evet, Sil
                                                    </button>
                                                    <button 
                                                        className="btn btn-outline btn-sm"
                                                        onClick={() => setDeleteConfirm(null)}
                                                    >
                                                        İptal
                                                    </button>
                                                </div>
                                            ) : (
                                                <button 
                                                    className="btn btn-outline btn-sm btn-delete"
                                                    onClick={() => setDeleteConfirm(post._id)}
                                                    title="Sil"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="profile-card">
                        <h2>Profil Ayarları</h2>
                        <form onSubmit={handleSubmit} className="profile-form">
                            <div className="avatar-section">
                                <div className="avatar-lg">
                                    {avatar ? (
                                        <img
                                            src={avatar.startsWith('http') ? avatar : `${API_URL}${avatar}`}
                                            alt="Avatar"
                                        />
                                    ) : (
                                        user?.username?.[0]?.toUpperCase() || '?'
                                    )}
                                </div>
                                <label className="btn btn-outline btn-sm">
                                    {uploading ? 'Yükleniyor...' : 'Avatar Değiştir'}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarUpload}
                                        hidden
                                        disabled={uploading}
                                    />
                                </label>
                            </div>

                            <div className="form-group">
                                <label htmlFor="username">Kullanıcı Adı</label>
                                <div className="input-icon">
                                    <User size={18} />
                                    <input
                                        id="username"
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        minLength={3}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>E-posta</label>
                                <div className="input-icon disabled">
                                    <Mail size={18} />
                                    <input type="email" value={user?.email || ''} disabled />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="bio">Hakkımda</label>
                                <textarea
                                    id="bio"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="Kendiniz hakkında kısa bir bilgi"
                                    rows={3}
                                    maxLength={500}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Yeni Parola (isteğe bağlı)</label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Değiştirmek istemiyorsanız boş bırakın"
                                    minLength={6}
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                <Save size={18} />
                                {loading ? 'Kaydediliyor...' : 'Kaydet'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
