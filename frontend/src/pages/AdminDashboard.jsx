import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    FileText,
    Clock,
    CheckCircle,
    XCircle,
    Eye,
    Heart,
    LayoutDashboard,
    Tags,
} from 'lucide-react';
import api from '../services/api';

export default function AdminDashboard() {
    const [posts, setPosts] = useState([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, suspended: 0 });
    const [filter, setFilter] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, [filter, page]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const params = { page, limit: 15 };
            if (filter) params.status = filter;
            const res = await api.get('/posts/admin/all', { params });
            setPosts(res.data.posts);
            setTotalPages(res.data.totalPages);

            // Fetch stats
            const [totalRes, pendingRes, approvedRes, suspendedRes] = await Promise.all([
                api.get('/posts/admin/all', { params: { limit: 1 } }),
                api.get('/posts/admin/all', { params: { status: 'pending', limit: 1 } }),
                api.get('/posts/admin/all', { params: { status: 'approved', limit: 1 } }),
                api.get('/posts/admin/all', { params: { status: 'suspended', limit: 1 } }),
            ]);
            setStats({
                total: totalRes.data.total,
                pending: pendingRes.data.total,
                approved: approvedRes.data.total,
                suspended: suspendedRes.data.total,
            });
        } catch (error) {
            console.error('Veriler yüklenemedi:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleModerate = async (postId, status) => {
        try {
            await api.put(`/posts/${postId}/moderate`, { status });
            fetchPosts();
        } catch (error) {
            console.error('Moderasyon hatası:', error);
        }
    };

    const statusLabel = {
        pending: { text: 'Bekliyor', className: 'badge-warning' },
        approved: { text: 'Onaylı', className: 'badge-success' },
        suspended: { text: 'Askıda', className: 'badge-danger' },
    };

    const formatDate = (d) =>
        new Date(d).toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });

    return (
        <div className="admin-page">
            <div className="container">
                <div className="admin-header">
                    <h1>
                        <LayoutDashboard size={28} />
                        Yönetim Paneli
                    </h1>
                    <Link to="/admin/kategoriler" className="btn btn-outline">
                        <Tags size={18} />
                        Kategoriler
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <FileText size={24} />
                        <div>
                            <span className="stat-number">{stats.total}</span>
                            <span className="stat-label">Toplam Yazı</span>
                        </div>
                    </div>
                    <div className="stat-card warning">
                        <Clock size={24} />
                        <div>
                            <span className="stat-number">{stats.pending}</span>
                            <span className="stat-label">Bekleyen</span>
                        </div>
                    </div>
                    <div className="stat-card success">
                        <CheckCircle size={24} />
                        <div>
                            <span className="stat-number">{stats.approved}</span>
                            <span className="stat-label">Onaylı</span>
                        </div>
                    </div>
                    <div className="stat-card danger">
                        <XCircle size={24} />
                        <div>
                            <span className="stat-number">{stats.suspended}</span>
                            <span className="stat-label">Askıda</span>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="admin-filters">
                    {['', 'pending', 'approved', 'suspended'].map((f) => (
                        <button
                            key={f}
                            className={`filter-chip ${filter === f ? 'active' : ''}`}
                            onClick={() => { setFilter(f); setPage(1); }}
                        >
                            {f === '' ? 'Tümü' : statusLabel[f].text}
                        </button>
                    ))}
                </div>

                {/* Posts Table */}
                {loading ? (
                    <div className="loading-container"><div className="spinner"></div></div>
                ) : (
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Başlık</th>
                                    <th>Yazar</th>
                                    <th>Kategori</th>
                                    <th>Durum</th>
                                    <th>Tarih</th>
                                    <th>İstatistikler</th>
                                    <th>İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {posts.map((post) => (
                                    <tr key={post._id}>
                                        <td>
                                            <Link to={`/yazi/${post._id}`} className="table-link">
                                                {post.title.substring(0, 50)}
                                                {post.title.length > 50 ? '...' : ''}
                                            </Link>
                                        </td>
                                        <td>{post.author?.username}</td>
                                        <td>{post.category?.name}</td>
                                        <td>
                                            <span className={`badge ${statusLabel[post.status]?.className}`}>
                                                {statusLabel[post.status]?.text}
                                            </span>
                                        </td>
                                        <td>{formatDate(post.createdAt)}</td>
                                        <td>
                                            <span className="stat-inline"><Eye size={14} /> {post.viewCount}</span>
                                            <span className="stat-inline"><Heart size={14} /> {post.likes?.length || 0}</span>
                                        </td>
                                        <td>
                                            <div className="action-btns">
                                                {post.status !== 'approved' && (
                                                    <button
                                                        className="btn btn-success btn-xs"
                                                        onClick={() => handleModerate(post._id, 'approved')}
                                                    >
                                                        Onayla
                                                    </button>
                                                )}
                                                {post.status !== 'suspended' && (
                                                    <button
                                                        className="btn btn-danger btn-xs"
                                                        onClick={() => handleModerate(post._id, 'suspended')}
                                                    >
                                                        Askıya Al
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="pagination">
                        <button
                            className="btn btn-outline"
                            disabled={page <= 1}
                            onClick={() => setPage(page - 1)}
                        >
                            Önceki
                        </button>
                        <span className="page-info">Sayfa {page} / {totalPages}</span>
                        <button
                            className="btn btn-outline"
                            disabled={page >= totalPages}
                            onClick={() => setPage(page + 1)}
                        >
                            Sonraki
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
