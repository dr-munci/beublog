import { Link } from 'react-router-dom';
import { Heart, Eye, Clock } from 'lucide-react';

export default function PostCard({ post }) {
    const API_URL = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const stripHtml = (html) => {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };

    const summary = post.summary || stripHtml(post.content).substring(0, 150) + '...';

    return (
        <article className="post-card">
            {post.coverImage && (
                <Link to={`/yazi/${post._id}`} className="post-card-image">
                    <img
                        src={post.coverImage.startsWith('http') ? post.coverImage : `${API_URL}${post.coverImage}`}
                        alt={post.title}
                        loading="lazy"
                    />
                </Link>
            )}
            <div className="post-card-body">
                {post.category && (
                    <span className="post-card-category">{post.category.name}</span>
                )}
                <Link to={`/yazi/${post._id}`}>
                    <h3 className="post-card-title">{post.title}</h3>
                </Link>
                <p className="post-card-summary">{summary}</p>
                <div className="post-card-meta">
                    <div className="post-card-author">
                        <div className="avatar-sm">
                            {post.author?.username?.[0]?.toUpperCase() || '?'}
                        </div>
                        <span>{post.author?.username}</span>
                    </div>
                    <div className="post-card-stats">
                        <span className="stat">
                            <Clock size={14} />
                            {formatDate(post.createdAt)}
                        </span>
                        <span className="stat">
                            <Heart size={14} />
                            {post.likes?.length || 0}
                        </span>
                        <span className="stat">
                            <Eye size={14} />
                            {post.viewCount || 0}
                        </span>
                    </div>
                </div>
            </div>
        </article>
    );
}
