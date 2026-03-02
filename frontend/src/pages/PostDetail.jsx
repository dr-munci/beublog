import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, Eye, Clock, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function PostDetail() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    const API_URL = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

    useEffect(() => {
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            const res = await api.get(`/posts/${id}`);
            setPost(res.data);
            setLikeCount(res.data.likes?.length || 0);
            if (user) {
                setLiked(res.data.likes?.includes(user.id));
            }
        } catch (error) {
            console.error('Yazı yüklenemedi:', error);
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        if (!user) return navigate('/giris');
        try {
            const res = await api.put(`/posts/${id}/like`);
            setLiked(!liked);
            setLikeCount(res.data.likeCount);
        } catch (error) {
            console.error('Beğeni hatası:', error);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Bu yazıyı silmek istediğinize emin misiniz?')) return;
        try {
            await api.delete(`/posts/${id}`);
            navigate('/');
        } catch (error) {
            console.error('Silme hatası:', error);
        }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="container">
                <div className="empty-state">
                    <p>Yazı bulunamadı.</p>
                    <Link to="/" className="btn btn-primary">Ana Sayfa</Link>
                </div>
            </div>
        );
    }

    const isOwner = user && (user.id === post.author?._id);
    const isAdmin = user && user.role === 'admin';

    return (
        <div className="post-detail-page">
            <div className="container">
                <Link to="/" className="back-link">
                    <ArrowLeft size={18} />
                    <span>Geri Dön</span>
                </Link>

                <article className="post-detail">
                    {post.coverImage && (
                        <div className="post-detail-cover">
                            <img
                                src={post.coverImage.startsWith('http') ? post.coverImage : `${API_URL}${post.coverImage}`}
                                alt={post.title}
                            />
                        </div>
                    )}

                    <div className="post-detail-header">
                        {post.category && (
                            <span className="post-card-category">{post.category.name}</span>
                        )}
                        <h1 className="post-detail-title">{post.title}</h1>

                        <div className="post-detail-meta">
                            <div className="post-detail-author">
                                <div className="avatar-md">
                                    {post.author?.username?.[0]?.toUpperCase() || '?'}
                                </div>
                                <div>
                                    <strong>{post.author?.username}</strong>
                                    <span className="meta-date">
                                        <Clock size={14} />
                                        {formatDate(post.createdAt)}
                                    </span>
                                </div>
                            </div>

                            <div className="post-detail-actions">
                                {(isOwner || isAdmin) && (
                                    <>
                                        <Link
                                            to={`/yazi-duzenle/${post._id}`}
                                            className="btn btn-outline btn-sm"
                                        >
                                            <Edit size={16} />
                                            Düzenle
                                        </Link>
                                        <button
                                            onClick={handleDelete}
                                            className="btn btn-danger btn-sm"
                                        >
                                            <Trash2 size={16} />
                                            Sil
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div
                        className="post-detail-content ql-editor"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {post.tags?.length > 0 && (
                        <div className="post-tags">
                            {post.tags.map((tag, i) => (
                                <span key={i} className="tag">#{tag}</span>
                            ))}
                        </div>
                    )}

                    <div className="post-detail-footer">
                        <button
                            className={`like-btn ${liked ? 'liked' : ''}`}
                            onClick={handleLike}
                        >
                            <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
                            <span>{likeCount} Beğeni</span>
                        </button>
                        <span className="view-count">
                            <Eye size={18} />
                            {post.viewCount} Görüntülenme
                        </span>
                    </div>
                </article>
            </div>
        </div>
    );
}
