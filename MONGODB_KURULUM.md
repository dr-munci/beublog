# MongoDB Atlas Kurulum Rehberi (Ücretsiz)

## 🎯 MongoDB Atlas Nedir?
MongoDB Atlas, bulut tabanlı ücretsiz MongoDB veritabanı hizmetidir. Verileriniz kalıcı olarak saklanır ve her yerden erişilebilir.

---

## 📝 Kurulum Adımları

### 1. Hesap Oluşturma
1. **https://www.mongodb.com/cloud/atlas** adresine gidin
2. **"Try Free"** butonuna tıklayın
3. Google hesabınızla veya email ile kayıt olun

### 2. Cluster Oluşturma
1. **"Build a Database"** seçin
2. **"M0 FREE"** (ücretsiz) planı seçin
3. Provider olarak **AWS** veya **Google Cloud** seçin
4. Region olarak **Frankfurt (eu-central-1)** veya en yakın bölgeyi seçin
5. Cluster adını **"BEUBlog"** yapabilirsiniz
6. **"Create"** butonuna tıklayın

### 3. Veritabanı Kullanıcısı Oluşturma
1. **Security > Database Access** menüsüne gidin
2. **"Add New Database User"** tıklayın
3. Authentication: **Password**
4. Username: `beublog`
5. Password: `GucluBirSifre123!` (kendi şifrenizi belirleyin)
6. **Built-in Role:** "Read and write to any database"
7. **"Add User"** tıklayın

### 4. IP Erişimi Ayarlama
1. **Security > Network Access** menüsüne gidin
2. **"Add IP Address"** tıklayın
3. **"Allow Access from Anywhere"** seçin (0.0.0.0/0)
4. **"Confirm"** tıklayın

### 5. Bağlantı String'ini Alma
1. **Database > Clusters** menüsüne gidin
2. **"Connect"** butonuna tıklayın
3. **"Connect your application"** seçin
4. Driver: **Node.js**, Version: **6.0 or later**
5. Connection string'i kopyalayın

Örnek format:
```
mongodb+srv://beublog:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### 6. Backend .env Dosyasını Güncelleme

`backend/.env` dosyasını açın ve MONGO_URI satırını güncelleyin:

```env
MONGO_URI=mongodb+srv://beublog:SIFRENIZ@cluster0.xxxxx.mongodb.net/beublog?retryWrites=true&w=majority
```

**Önemli:** 
- `<password>` yerine oluşturduğunuz şifreyi yazın
- `cluster0.xxxxx` kısmını kendi cluster adresinizle değiştirin
- Sonuna `/beublog` ekleyin (veritabanı adı)

---

## 🔄 Sunucuyu Yeniden Başlatma

Bağlantı string'ini güncelledikten sonra backend'i yeniden başlatın:

```bash
cd backend
npm run dev
```

Konsolda şunu görmelisiniz:
```
✓ MongoDB bağlantısı başarılı: mongodb+srv://...
```

---

## ✅ Test Etme

Tarayıcıda şu adresi açın:
```
http://localhost:5000/api/db-status
```

Bağlantı başarılıysa veritabanı tablolarını göreceksiniz.

---

## 🆘 Sorun Giderme

### "Authentication failed" hatası
- Kullanıcı adı ve şifreyi kontrol edin
- Şifrede özel karakterler varsa URL encode yapın

### "Network error" hatası
- IP erişim listesinde 0.0.0.0/0 olduğundan emin olun
- İnternet bağlantınızı kontrol edin

### "Connection timed out" hatası
- Firewall ayarlarını kontrol edin
- VPN kullanıyorsanız kapatmayı deneyin
