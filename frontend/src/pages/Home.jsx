import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import api from '../services/api';
import PostCard from '../components/PostCard';

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();

    const page = parseInt(searchParams.get('page') || '1');
    const category = searchParams.get('kategori') || '';
    const search = searchParams.get('ara') || '';
    const sort = searchParams.get('siralama') || 'newest';

    const [searchInput, setSearchInput] = useState(search);

    useEffect(() => {
        fetchPosts();
    }, [page, category, search, sort]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const params = { page, limit: 12, sort };
            if (category) params.category = category;
            if (search) params.search = search;
            const res = await api.get('/posts', { params });
            setPosts(res.data.posts);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.error('Yazılar yüklenemedi:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch (error) {
            console.error('Kategoriler yüklenemedi:', error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams);
        if (searchInput) {
            params.set('ara', searchInput);
        } else {
            params.delete('ara');
        }
        params.set('page', '1');
        setSearchParams(params);
    };

    const handleCategoryFilter = (catId) => {
        const params = new URLSearchParams(searchParams);
        if (catId) {
            params.set('kategori', catId);
        } else {
            params.delete('kategori');
        }
        params.set('page', '1');
        setSearchParams(params);
    };

    const handleSort = (newSort) => {
        const params = new URLSearchParams(searchParams);
        params.set('siralama', newSort);
        params.set('page', '1');
        setSearchParams(params);
    };

    const handlePage = (newPage) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage.toString());
        setSearchParams(params);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <h1 className="hero-title">
                        Düşüncelerinizi <span className="gradient-text">Paylaşın</span>
                    </h1>
                    <p className="hero-subtitle">
                        Fikirlerinizi yazın, keşfedin ve toplulukla paylaşın
                    </p>
                    <form className="hero-search" onSubmit={handleSearch}>
                        <div className="search-input-wrapper">
                            <Search size={20} />
                            <input
                                type="text"
                                placeholder="Yazı ara..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="search-input"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Ara
                        </button>
                    </form>
                </div>
            </section>

            {/* Filters */}
            <section className="container">
                <div className="filters-bar">
                    <div className="category-filters">
                        <button
                            className={`filter-chip ${!category ? 'active' : ''}`}
                            onClick={() => handleCategoryFilter('')}
                        >
                            Tümü
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat._id}
                                className={`filter-chip ${category === cat._id ? 'active' : ''}`}
                                onClick={() => handleCategoryFilter(cat._id)}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                    <div className="sort-options">
                        <Filter size={16} />
                        <select
                            value={sort}
                            onChange={(e) => handleSort(e.target.value)}
                            className="sort-select"
                        >
                            <option value="newest">En Yeni</option>
                            <option value="oldest">En Eski</option>
                            <option value="popular">En Çok Okunan</option>
                            <option value="liked">En Çok Beğenilen</option>
                        </select>
                    </div>
                </div>

                {/* Posts Grid */}
                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="empty-state">
                        <p>Henüz yazı bulunamadı.</p>
                    </div>
                ) : (
                    <>
                        <div className="posts-grid">
                            {posts.map((post) => (
                                <PostCard key={post._id} post={post} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    className="btn btn-outline"
                                    disabled={page <= 1}
                                    onClick={() => handlePage(page - 1)}
                                >
                                    Önceki
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <button
                                        key={p}
                                        className={`btn ${p === page ? 'btn-primary' : 'btn-outline'}`}
                                        onClick={() => handlePage(p)}
                                    >
                                        {p}
                                    </button>
                                ))}
                                <button
                                    className="btn btn-outline"
                                    disabled={page >= totalPages}
                                    onClick={() => handlePage(page + 1)}
                                >
                                    Sonraki
                                </button>
                            </div>
                        )}
                    </>
                )}
            </section>
        </div>
    );
}
