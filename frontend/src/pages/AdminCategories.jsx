import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Plus,
    Edit2,
    Trash2,
    ArrowLeft,
    AlertCircle,
    CheckCircle,
} from 'lucide-react';
import api from '../services/api';

export default function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch (error) {
            console.error('Kategoriler yüklenemedi:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            if (editingId) {
                await api.put(`/categories/${editingId}`, { name, description });
                setSuccess('Kategori güncellendi');
            } else {
                await api.post('/categories', { name, description });
                setSuccess('Kategori oluşturuldu');
            }
            setName('');
            setDescription('');
            setEditingId(null);
            fetchCategories();
        } catch (err) {
            setError(err.response?.data?.message || 'İşlem başarısız');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (cat) => {
        setEditingId(cat._id);
        setName(cat.name);
        setDescription(cat.description || '');
        setError('');
        setSuccess('');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) return;
        try {
            await api.delete(`/categories/${id}`);
            setSuccess('Kategori silindi');
            fetchCategories();
        } catch (err) {
            setError(err.response?.data?.message || 'Silme başarısız');
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setName('');
        setDescription('');
        setError('');
        setSuccess('');
    };

    return (
        <div className="admin-page">
            <div className="container">
                <div className="admin-header">
                    <h1>Kategori Yönetimi</h1>
                    <Link to="/admin" className="btn btn-outline">
                        <ArrowLeft size={18} />
                        Panele Dön
                    </Link>
                </div>

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

                {/* Add/Edit Form */}
                <div className="category-form-card">
                    <h2>{editingId ? 'Kategori Düzenle' : 'Yeni Kategori'}</h2>
                    <form onSubmit={handleSubmit} className="category-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="cat-name">Kategori Adı</label>
                                <input
                                    id="cat-name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Kategori adı"
                                    required
                                    maxLength={50}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="cat-desc">Açıklama</label>
                                <input
                                    id="cat-desc"
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Kısa açıklama (isteğe bağlı)"
                                    maxLength={200}
                                />
                            </div>
                        </div>
                        <div className="form-actions">
                            {editingId && (
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={handleCancel}
                                >
                                    İptal
                                </button>
                            )}
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                <Plus size={18} />
                                {editingId ? 'Güncelle' : 'Ekle'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Categories List */}
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Ad</th>
                                <th>Slug</th>
                                <th>Açıklama</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center">
                                        Henüz kategori yok
                                    </td>
                                </tr>
                            ) : (
                                categories.map((cat) => (
                                    <tr key={cat._id}>
                                        <td><strong>{cat.name}</strong></td>
                                        <td><code>{cat.slug}</code></td>
                                        <td>{cat.description || '-'}</td>
                                        <td>
                                            <div className="action-btns">
                                                <button
                                                    className="btn btn-outline btn-xs"
                                                    onClick={() => handleEdit(cat)}
                                                >
                                                    <Edit2 size={14} />
                                                    Düzenle
                                                </button>
                                                <button
                                                    className="btn btn-danger btn-xs"
                                                    onClick={() => handleDelete(cat._id)}
                                                >
                                                    <Trash2 size={14} />
                                                    Sil
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
