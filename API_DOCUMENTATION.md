# 📖 SIPANGAN API Documentation

Selamat datang di dokumentasi API SIPANGAN (Sistem Informasi Harga Pangan). Dokumen ini dirancang untuk membantu tim Frontend mengintegrasikan layanan backend SIPANGAN ke dalam aplikasi.

## 🚀 Base URL

| Environment | URL |
| :--- | :--- |
| **Development** | `http://localhost:3000` |
| **Production** | `https://api.sipangan.subly.my.id` |

---

## 🔐 Authentication

API SIPANGAN menggunakan dua lapis keamanan:

### 1. API Key (Public Access)
Setiap request **WAJIB** menyertakan header `x-api-key`. Tanpa ini, server akan mengembalikan `401 Unauthorized`.
- **Header Name**: `x-api-key`
- **Value**: (Dapatkan dari file `.env` - `API_KEY`)

### 2. JWT Bearer Token (Protected Access)
Untuk fitur yang bersifat modifikasi data (POST, PUT, DELETE), Anda wajib menyertakan Access Token yang didapat setelah login.
- **Header Name**: `Authorization`
- **Value**: `Bearer <your_access_token>`

---

## 📂 API Endpoints

### 🔑 Authentication
Digunakan untuk manajemen sesi pengguna.

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Login user & dapatkan token | API Key |
| `PUT` | `/api/v1/auth/refresh` | Perbarui Access Token (Refresh) | API Key |
| `DELETE` | `/api/v1/auth/logout` | Logout & hapus sesi | API Key |

#### Login Request Payload
```json
{
  "username": "user_sipangan",
  "password": "password123"
}
```

---

### 🍎 Commodities
Manajemen data jenis komoditas pangan.

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/commodities` | Ambil daftar semua komoditas | API Key |
| `POST` | `/api/v1/commodities` | Tambah komoditas baru | API Key + JWT |
| `PUT` | `/api/v1/commodities/:id` | Update data komoditas | API Key + JWT |
| `DELETE` | `/api/v1/commodities/:id` | Hapus komoditas | API Key + JWT |

---

### 📈 Prices (History)
Data riwayat harga pangan di berbagai wilayah.

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/prices` | Ambil riwayat harga (Filterable) | API Key |
| `GET` | `/api/v1/prices/overview` | Ringkasan harga terbaru | API Key |
| `POST` | `/api/v1/prices` | Input harga pangan baru | API Key + JWT |
| `PUT` | `/api/v1/prices/:id` | Update data harga | API Key + JWT |
| `DELETE` | `/api/v1/prices/:id` | Hapus data harga | API Key + JWT |

**Query Parameters for `GET /api/v1/prices`:**
- `commodity`: Filter berdasarkan nama komoditas (misal: `Beras Medium`)
- `region`: Filter berdasarkan nama wilayah (misal: `Jawa Tengah`)

---

### 🔮 Predictions
Hasil prediksi harga pangan masa depan menggunakan AI.

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/predict` | Ambil prediksi harga masa depan | API Key |

**Query Parameters (Wajib):**
- `commodity`: `Beras Medium`
- `region`: `Jawa Tengah`

---

### 🗺️ Maps
Data koordinat wilayah untuk visualisasi peta.

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/maps` | Ambil koordinat wilayah | API Key |

---

### 🔔 Alerts
Notifikasi peringatan kenaikan harga yang tidak wajar.

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/alerts` | Ambil daftar peringatan | API Key |

---

## 📦 Response Format

### Success Response
```json
{
  "status": "success",
  "message": "Operasi berhasil",
  "data": { ... }
}
```

### Error Response
```json
{
  "status": "fail",
  "message": "Pesan detail kesalahan"
}
```

---

## 🛠️ Interactive Documentation

Anda juga dapat mengakses dokumentasi interaktif (Swagger UI) yang memungkinkan Anda mencoba API secara langsung:

- **URL**: `BASE_URL/api-docs`
- **Username**: `admin` (Default)
- **Password**: `admin123` (Default)

---

## 📮 Postman Collection

Kami telah menyediakan file koleksi Postman di root project:
1. `SIPANGAN_API.postman_collection.json`
2. `SIPANGAN_API.postman_environment.json`

Silakan import file tersebut ke Postman Anda untuk memudahkan pengujian.
