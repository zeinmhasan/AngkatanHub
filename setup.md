# AngkatanHub - Portal Informasi Angkatan Terintegrasi

"AngkatanHub" adalah portal informasi untuk koordinasi angkatan kuliah yang dibangun dengan teknologi modern seperti TypeScript, React, Tailwind CSS, Express.js, dan Node.js.

## 🚀 Fitur Utama

### 1. Authentication & User Management
- Login/Register sistem
- Role-based access (Admin, Perwakilan Kelas, User)
- Profile management

### 2. Core Features
- Jadwal Kuliah (per kelas A, B, C)
- Manajemen Tugas (deadline tracking, filter per kelas)
- Kegiatan Angkatan (event management + pendaftaran)
- Info Eksternal (oprec, lomba, beasiswa)
- Forum Diskusi (Q&A antar anggota)
- Afirmasi Harian (motivational quotes)

### 3. Additional Features
- Notifikasi deadline
- Kalender terintegrasi
- Export jadwal
- Search & filter multi-kategori
- Responsive design

## 🛠️ Teknologi yang Digunakan

### Frontend
- **React** - Library JavaScript untuk membangun UI
- **TypeScript** - Superset dari JavaScript dengan type safety
- **Tailwind CSS** - Framework CSS untuk styling
- **React Router** - Untuk navigasi antar halaman
- **Lucide React** - Icon library

### Backend
- **Express.js** - Framework web untuk Node.js
- **Node.js** - Platform untuk menjalankan JavaScript di sisi server
- **MongoDB** - Database NoSQL
- **Mongoose** - ODM (Object Data Modeling) untuk MongoDB
- **JSON Web Token** - Untuk authentication
- **Bcrypt** - Untuk hashing password

## 📋 Persyaratan Sistem

- Node.js (versi 16 atau lebih tinggi)
- npm atau yarn
- MongoDB (local atau cloud)

## 🚀 Cara Menjalankan Aplikasi

### 1. Clone Repository
```bash
git clone <repository-url>
cd angkatan-hub
```

### 2. Install Dependencies
```bash
# Install dependencies untuk root project
npm install

# Install dependencies untuk client
cd client
npm install

# Kembali ke root
cd ..

# Install dependencies untuk server
cd server
npm install

# Kembali ke root
cd ..
```

### 3. Setup Environment Variables

Buat file `.env` di folder `server`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/angkatan-hub
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=http://localhost:3000
```

Buat file `.env` di folder `client`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Jalankan Aplikasi

#### Development Mode
Jalankan client dan server secara bersamaan:
```bash
npm run dev
```

Atau jalankan masing-masing:
```bash
# Jalankan client (di folder client)
cd client
npm run dev

# Jalankan server (di folder server)
cd server
npm run dev
```

#### Production Mode
Build aplikasi:
```bash
npm run build
```

Kemudian jalankan server:
```bash
npm start
```

### 5. Akses Aplikasi

- Client: http://localhost:3000
- Server API: http://localhost:5000/api

## 🏗️ Struktur Proyek

```
angkatan-hub/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── layout/
│   │   │   ├── schedule/
│   │   │   ├── assignments/
│   │   │   ├── activities/
│   │   │   ├── forum/
│   │   │   └── external-info/
│   │   ├── pages/
│   │   ├── types/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── services/
├── server/                 # Express Backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── types/
└── package.json           # Root package.json
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register user baru
- `GET /api/auth/me` - Get profile user

### Schedule
- `GET /api/schedule?class=A` - Get jadwal berdasarkan kelas
- `POST /api/schedule` - Create jadwal baru
- `PUT /api/schedule/:id` - Update jadwal
- `DELETE /api/schedule/:id` - Delete jadwal

### Assignments
- `GET /api/assignments?class=A&status=pending` - Get tugas berdasarkan kelas dan status
- `POST /api/assignments` - Create tugas baru
- `PUT /api/assignments/:id` - Update tugas
- `PATCH /api/assignments/:id/complete` - Toggle status tugas
- `DELETE /api/assignments/:id` - Delete tugas

### Activities
- `GET /api/activities` - Get semua kegiatan
- `POST /api/activities` - Create kegiatan baru
- `POST /api/activities/:id/register` - Mendaftar kegiatan
- `PUT /api/activities/:id` - Update kegiatan
- `DELETE /api/activities/:id` - Delete kegiatan

### Forum
- `GET /api/forum/posts` - Get semua postingan forum
- `POST /api/forum/posts` - Create postingan forum baru
- `GET /api/forum/posts/:id` - Get detail postingan forum
- `POST /api/forum/posts/:id/comments` - Add komentar
- `PUT /api/forum/posts/:id/upvote` - Upvote postingan

### External Info
- `GET /api/external-info?category=oprec` - Get info eksternal berdasarkan kategori
- `POST /api/external-info` - Create info eksternal baru
- `PUT /api/external-info/:id` - Update info eksternal
- `DELETE /api/external-info/:id` - Delete info eksternal

### Affirmations
- `GET /api/affirmations/daily` - Get afirmasi harian

## 🎨 UI/UX Design

### Warna
- **Primary**: #667eea (Ungu muda), #5a67d8 (Ungu), #4c51bf (Ungu tua)
- **Secondary**: #764ba2 (Ungu tua), #6b46c1 (Ungu ungu)
- **Accent**: #f093fb (Pink)
- **Gray**: #f8f9fa (Abu-abu muda), #f1f3f4 (Abu-abu), #2d3748 (Abu-abu tua)

### Typography
- **Heading**: Inter, 600 weight
- **Body**: Inter, 400 weight

## 📱 Responsive Design

Aplikasi dirancang untuk dapat diakses dari berbagai perangkat:
- Desktop (1280px ke atas)
- Tablet (768px - 1279px)
- Mobile (hingga 767px)

## 🤝 Kontribusi

1. Fork repository ini
2. Buat branch fitur baru (`git checkout -b fitur/NamaFitur`)
3. Commit perubahan (`git commit -m 'Tambahkan fitur NamaFitur'`)
4. Push ke branch (`git push origin fitur/NamaFitur`)
5. Buka Pull Request

## 📄 Lisensi

Proyek ini dilisensikan di bawah MIT License - lihat file [LICENSE](LICENSE) untuk detail lebih lanjut.