import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="not-found-page">
            <div className="not-found-content">
                <h1 className="not-found-code">404</h1>
                <h2>Sayfa Bulunamadı</h2>
                <p>Aradığınız sayfa mevcut değil veya taşınmış olabilir.</p>
                <Link to="/" className="btn btn-primary">
                    Ana Sayfaya Dön
                </Link>
            </div>
        </div>
    );
}
