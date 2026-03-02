import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AdminCategories from './pages/AdminCategories';
import NotFound from './pages/NotFound';

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Router>
                    <div className="app">
                        <Navbar />
                        <main className="main-content">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/giris" element={<Login />} />
                                <Route path="/kayit" element={<Register />} />
                                <Route path="/yazi/:id" element={<PostDetail />} />
                                <Route
                                    path="/yazi-olustur"
                                    element={
                                        <ProtectedRoute>
                                            <CreatePost />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/yazi-duzenle/:id"
                                    element={
                                        <ProtectedRoute>
                                            <EditPost />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/profil"
                                    element={
                                        <ProtectedRoute>
                                            <Profile />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/admin"
                                    element={
                                        <ProtectedRoute adminOnly>
                                            <AdminDashboard />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/admin/kategoriler"
                                    element={
                                        <ProtectedRoute adminOnly>
                                            <AdminCategories />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </main>
                        <Footer />
                    </div>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
