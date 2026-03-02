import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImagePlus, X, AlertCircle } from 'lucide-react';
import api from '../services/api';
import RichTextEditor from '../components/RichTextEditor';

export default function CreatePost() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [summary, setSummary] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [tags, setTags] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [categories, setCategories] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const API_URL = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

    useEffect(() => {
        api.get('/categories').then((res) => setCategories(res.data));
    }, []);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setUploading(true);
        try {
            const res = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setCoverImage(res.data.url);
        } catch (err) {
            setError(err.response?.data?.message || 'Görsel yüklenemedi');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!content || content === '<p><br></p>') {
            return setError('İçerik zorunludur');
        }

        setLoading(true);
        try {
            const postData = {
                title,
                content,
                summary,
                category: categoryId,
                coverImage,
                tags: tags
                    .split(',')
                    .map((t) => t.trim())
                    .filter(Boolean),
            };
            const res = await api.post('/posts', postData);
            navigate(`/yazi/${res.data._id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Yazı oluşturulamadı');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="post-form-page">
            <div className="container">
                <h1>Yeni Yazı Oluştur</h1>

                {error && (
                    <div className="alert alert-error">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="post-form">
                    <div className="form-group">
                        <label htmlFor="title">Başlık</label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Yazı başlığı"
                            required
                            maxLength={200}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="summary">Özet</label>
                        <textarea
                            id="summary"
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            placeholder="Kısa bir özet (isteğe bağlı)"
                            rows={2}
                            maxLength={500}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="category">Kategori</label>
                            <select
                                id="category"
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                required
                            >
                                <option value="">Kategori seçin</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="tags">Etiketler</label>
                            <input
                                id="tags"
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="etiket1, etiket2, etiket3"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Kapak Görseli</label>
                        <div className="cover-upload">
                            {coverImage ? (
                                <div className="cover-preview">
                                    <img
                                        src={coverImage.startsWith('http') ? coverImage : `${API_URL}${coverImage}`}
                                        alt="Kapak"
                                    />
                                    <button
                                        type="button"
                                        className="cover-remove"
                                        onClick={() => setCoverImage('')}
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            ) : (
                                <label className="cover-upload-btn">
                                    <ImagePlus size={24} />
                                    <span>{uploading ? 'Yükleniyor...' : 'Görsel Seç'}</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        hidden
                                        disabled={uploading}
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>İçerik</label>
                        <RichTextEditor value={content} onChange={setContent} />
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={() => navigate(-1)}
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Oluşturuluyor...' : 'Yazıyı Yayınla'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
