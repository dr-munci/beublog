# 📝 BEUBlog

<div align="center">

![BEUBlog Banner](https://img.shields.io/badge/BEUBlog-Modern%20Blog%20Platform-6366f1?style=for-the-badge&logo=blogger&logoColor=white)

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Express](https://img.shields.io/badge/Express-5.0-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**Modern, full-stack blog platformu** | React + Node.js + MongoDB

[Özellikler](#-öne-çıkan-özellikler) • [Kurulum](#-kurulum) • [API](#-api-endpoints) • [Teknolojiler](#️-teknoloji-yığını)

</div>

---

## 🎯 Proje Hakkında

BEUBlog, modern web teknolojileri kullanılarak geliştirilmiş, tam özellikli bir blog platformudur. Kullanıcılar kayıt olabilir, blog yazıları oluşturabilir, düzenleyebilir ve diğer yazıları beğenebilir. Admin paneli ile içerik moderasyonu ve kategori yönetimi yapılabilir.

### ✨ Öne Çıkan Özellikler

- 🔐 **JWT Tabanlı Kimlik Doğrulama** - Güvenli kullanıcı girişi
- 👥 **Rol Tabanlı Yetkilendirme** - Kullanıcı ve Admin rolleri
- 📝 **Zengin Metin Editörü** - WYSIWYG ile kolay içerik oluşturma
- 🏷️ **Kategori Sistemi** - Yazıları kategorilere ayırma
- ❤️ **Beğeni Sistemi** - Yazıları beğenme
- 🌙 **Karanlık/Aydınlık Tema** - Göz dostu arayüz
- 📱 **Responsive Tasarım** - Mobil uyumlu
- 🖼️ **Görsel Yükleme** - Kapak görseli ve içerik görselleri
- ✅ **İçerik Moderasyonu** - Admin onay sistemi

---

## 🛠️ Teknoloji Yığını

### Frontend
| Teknoloji | Açıklama |
|-----------|----------|
| **React 18** | UI kütüphanesi |
| **Vite** | Build tool & dev server |
| **React Router DOM** | SPA yönlendirme |
| **React Quill** | Zengin metin editörü |
| **Axios** | HTTP istemcisi |
| **Lucide React** | İkon kütüphanesi |

### Backend
| Teknoloji | Açıklama |
|-----------|----------|
| **Node.js** | JavaScript runtime |
| **Express 5** | Web framework |
| **MongoDB** | NoSQL veritabanı |
| **Mongoose** | ODM |
| **JWT** | Kimlik doğrulama |
| **Multer** | Dosya yükleme |
| **bcryptjs** | Parola şifreleme |

### DevOps
| Teknoloji | Açıklama |
|-----------|----------|
| **Docker** | Konteynerizasyon |
| **Docker Compose** | Multi-container orchestration |
| **MongoDB Atlas** | Bulut veritabanı |

---

## 🚀 Kurulum

### Gereksinimler

- Node.js 18+
- npm veya yarn
- MongoDB (yerel veya Atlas)

### 1️⃣ Projeyi Klonlayın

```bash
git clone https://github.com/KULLANICI_ADI/beublog.git
cd beublog
```

### 2️⃣ Backend Kurulumu

```bash
cd backend
npm install

# .env dosyası oluşturun
cp .env.example .env

# .env dosyasını düzenleyin
# MONGO_URI=mongodb+srv://...
# JWT_SECRET=your-secret-key
```

### 3️⃣ Frontend Kurulumu

```bash
cd frontend
npm install
```

### 4️⃣ Uygulamayı Başlatın

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend (ayrı terminalde):**
```bash
cd frontend
npm run dev
```

### 5️⃣ Tarayıcıda Açın

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **DB Durumu:** http://localhost:5000/api/db-status

---

## 🐳 Docker ile Kurulum

```bash
# JWT secret ayarlayın
export JWT_SECRET=guclu-bir-secret-key

# Tüm servisleri başlatın
docker compose up -d
```

Servisler:
- **Frontend:** http://localhost
- **Backend:** http://localhost:5000
- **MongoDB:** localhost:27017

---

## 📁 Proje Yapısı

```
beublog/
├── 📂 backend/
│   ├── 📂 models/           # Mongoose şemaları
│   │   ├── User.js          # Kullanıcı modeli
│   │   ├── Post.js          # Yazı modeli
│   │   └── Category.js      # Kategori modeli
│   ├── 📂 routes/           # API rotaları
│   │   ├── auth.js          # Kimlik doğrulama
│   │   ├── posts.js         # Yazı işlemleri
│   │   ├── categories.js    # Kategori işlemleri
│   │   └── upload.js        # Dosya yükleme
│   ├── 📂 middleware/       # Ara katmanlar
│   │   ├── auth.js          # JWT doğrulama
│   │   └── upload.js        # Multer yapılandırması
│   ├── server.js            # Ana sunucu dosyası
│   ├── Dockerfile
│   └── package.json
│
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── 📂 components/   # React bileşenleri
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── PostCard.jsx
│   │   │   └── ...
│   │   ├── 📂 pages/        # Sayfa bileşenleri
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── ...
│   │   ├── 📂 context/      # React Context
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── 📂 services/     # API servisi
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🔌 API Endpoints

### Kimlik Doğrulama
| Method | Endpoint | Açıklama | Yetki |
|--------|----------|----------|-------|
| POST | `/api/auth/register` | Kullanıcı kaydı | Herkese |
| POST | `/api/auth/login` | Giriş yap | Herkese |
| GET | `/api/auth/me` | Profil bilgisi | Auth |
| PUT | `/api/auth/me` | Profil güncelle | Auth |

### Yazılar
| Method | Endpoint | Açıklama | Yetki |
|--------|----------|----------|-------|
| GET | `/api/posts` | Onaylı yazılar | Herkese |
| GET | `/api/posts/my` | Kendi yazılarım | Auth |
| GET | `/api/posts/:id` | Yazı detay | Herkese |
| POST | `/api/posts` | Yazı oluştur | Auth |
| PUT | `/api/posts/:id` | Yazı düzenle | Yazar/Admin |
| DELETE | `/api/posts/:id` | Yazı sil | Yazar/Admin |
| PUT | `/api/posts/:id/like` | Beğen/kaldır | Auth |

### Kategoriler
| Method | Endpoint | Açıklama | Yetki |
|--------|----------|----------|-------|
| GET | `/api/categories` | Tüm kategoriler | Herkese |
| POST | `/api/categories` | Kategori oluştur | Admin |
| PUT | `/api/categories/:id` | Kategori güncelle | Admin |
| DELETE | `/api/categories/:id` | Kategori sil | Admin |

### Admin
| Method | Endpoint | Açıklama | Yetki |
|--------|----------|----------|-------|
| GET | `/api/posts/admin/all` | Tüm yazılar | Admin |
| PUT | `/api/posts/:id/moderate` | Onayla/askıya al | Admin |

### Diğer
| Method | Endpoint | Açıklama | Yetki |
|--------|----------|----------|-------|
| POST | `/api/upload` | Görsel yükle | Auth |
| GET | `/api/health` | Sunucu durumu | Herkese |
| GET | `/api/db-status` | Veritabanı durumu | Herkese |

---

## 👤 Varsayılan Kullanıcı

Uygulama ilk çalıştırıldığında otomatik olarak admin kullanıcısı oluşturulur:

```
Email: admin@beublog.com
Şifre: admin123
Rol: admin
```

---

## 🎨 Özellikler Detayı

### Kullanıcı Özellikleri
- ✅ Kayıt ol ve giriş yap
- ✅ Profil düzenleme (avatar, bio, şifre)
- ✅ Yazı oluşturma ve düzenleme
- ✅ Kendi yazılarını görüntüleme
- ✅ Yazı beğenme

### Admin Özellikleri
- ✅ Tüm yazıları görüntüleme
- ✅ Yazıları onaylama/askıya alma
- ✅ Kategori yönetimi (CRUD)
- ✅ İstatistik görüntüleme

### Yazı Durumları
| Durum | Açıklama |
|-------|----------|
| `pending` | Onay bekliyor |
| `approved` | Onaylandı (herkese görünür) |
| `suspended` | Askıya alındı |

---

## 🔒 Güvenlik

- Parolalar **bcrypt** ile hashlenir
- JWT token'lar **HTTP-only cookie** veya header ile taşınır
- Dosya yükleme boyutu sınırlı (10MB)
- Sadece belirli dosya türleri kabul edilir (JPEG, PNG, GIF, WebP, SVG)

---

## 📱 Ekran Görüntüleri

<table>
  <tr>
    <td width="50%">
      <h3 align="center">🏠 Ana Sayfa</h3>
      <p align="center">Modern tasarım, kategori filtreleri, arama ve sıralama özellikleri</p>
    </td>
    <td width="50%">
      <h3 align="center">📖 Yazı Detay</h3>
      <p align="center">Zengin içerik görüntüleme, beğeni sistemi ve yazar bilgisi</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3 align="center">⚙️ Admin Panel</h3>
      <p align="center">Yazı moderasyonu, istatistikler ve içerik yönetimi</p>
    </td>
    <td width="50%">
      <h3 align="center">👤 Profil</h3>
      <p align="center">Kullanıcı yazıları, düzenleme ve profil ayarları</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3 align="center">✍️ Yazı Oluştur</h3>
      <p align="center">WYSIWYG editör, kapak görseli ve kategori seçimi</p>
    </td>
    <td width="50%">
      <h3 align="center">🌙 Karanlık Tema</h3>
      <p align="center">Göz dostu karanlık mod desteği</p>
    </td>
  </tr>
</table>

> 📸 **Not:** Uygulamayı yerel olarak çalıştırarak tüm özellikleri deneyimleyebilirsiniz.

---

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'i push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

---

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

## 📞 İletişim

Sorularınız için issue açabilirsiniz.

---

<div align="center">

**⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!**

Made with ❤️ using React & Node.js

</div>
