import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
    Sun,
    Moon,
    PenSquare,
    LogOut,
    User,
    LayoutDashboard,
    Menu,
    X,
} from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setMenuOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="container navbar-content">
                <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
                    <span className="brand-icon">✍</span>
                    <span>BEUBlog</span>
                </Link>

                <button
                    className="mobile-menu-btn"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Menü"
                >
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
                    <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
                        Ana Sayfa
                    </Link>

                    {user ? (
                        <>
                            <Link
                                to="/yazi-olustur"
                                className="nav-link"
                                onClick={() => setMenuOpen(false)}
                            >
                                <PenSquare size={18} />
                                <span>Yeni Yazı</span>
                            </Link>

                            {user.role === 'admin' && (
                                <Link
                                    to="/admin"
                                    className="nav-link"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    <LayoutDashboard size={18} />
                                    <span>Yönetim</span>
                                </Link>
                            )}

                            <Link
                                to="/profil"
                                className="nav-link"
                                onClick={() => setMenuOpen(false)}
                            >
                                <User size={18} />
                                <span>{user.username}</span>
                            </Link>

                            <button onClick={handleLogout} className="nav-link nav-btn-logout">
                                <LogOut size={18} />
                                <span>Çıkış</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/giris"
                                className="nav-link"
                                onClick={() => setMenuOpen(false)}
                            >
                                Giriş Yap
                            </Link>
                            <Link
                                to="/kayit"
                                className="nav-link btn btn-primary btn-sm"
                                onClick={() => setMenuOpen(false)}
                            >
                                Kayıt Ol
                            </Link>
                        </>
                    )}

                    <button
                        onClick={toggleTheme}
                        className="theme-toggle"
                        aria-label="Tema değiştir"
                        title={theme === 'light' ? 'Karanlık tema' : 'Aydınlık tema'}
                    >
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                </div>
            </div>
        </nav>
    );
}
