import { Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container footer-content">
                <div className="footer-brand">
                    <span className="brand-icon">✍</span>
                    <span>BEUBlog</span>
                </div>
                <p className="footer-text">
                    <Heart size={14} className="footer-heart" />
                    ile yapıldı &copy; {new Date().getFullYear()}
                </p>
                <div className="footer-links">
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                        GitHub
                    </a>
                </div>
            </div>
        </footer>
    );
}
