# Ficky Busuk - Aplikasi Klinik Hewan Fullstack

Ficky Busuk adalah aplikasi web klinik hewan modern untuk membantu pelanggan melihat layanan klinik, melihat dokter hewan, melakukan reservasi pemeriksaan, dan mengirim pesan konsultasi. Admin dapat mengelola layanan, dokter, reservasi, pembayaran, testimoni, dan pesan konsultasi pelanggan.

## Tech Stack

- **Frontend**: React, Vite, React Router DOM, Tailwind CSS, Lucide React
- **Backend**: Node.js, Express.js, MySQL2, JSON Web Token (JWT), Bcrypt, CORS, Dotenv, Nodemon
- **Database**: MySQL / MariaDB

---

## Cara Install & Menjalankan Aplikasi

Ikuti langkah-langkah di bawah ini untuk menjalankan aplikasi secara lokal di komputer Anda.

### 1. Prasyarat (Prerequisites)
Pastikan Anda sudah menginstal:
- [Node.js](https://nodejs.org/) (Versi LTS direkomendasikan)
- [MySQL Server](https://dev.mysql.com/downloads/installer/) / MariaDB (XAMPP/Laragon) yang berjalan di port default `3306`

### 2. Konfigurasi Lingkungan (Environment Variables)

- **Frontend**: Konfigurasi file `.env.local` di root folder:
  ```env
  VITE_API_BASE=http://localhost:5000/api
  ```
- **Backend**: Konfigurasi file `backend/.env` di folder `backend/`:
  ```env
  PORT=5000
  DB_HOST=localhost
  DB_PORT=3306
  DB_USER=root
  DB_PASSWORD=
  DB_NAME=ficky_busuk_db
  JWT_SECRET=change_this_secret_ficky_busuk_2026
  JWT_EXPIRES_IN=8h
  FRONTEND_URL=http://localhost:5173
  ```

### 3. Instalasi Dependensi

Jalankan instalasi dependensi untuk frontend dan backend.

#### Instal Dependensi Frontend:
Buka terminal di root folder (`ficky-busuk/`) lalu jalankan:
```bash
npm install
```

#### Instal Dependensi Backend:
Pindah ke subfolder `backend/` lalu jalankan:
```bash
cd backend
npm install
```

### 4. Setup Database & Impor Skema

Pastikan server MySQL Anda aktif. Impor file skema database `schema.sql` untuk membuat database `ficky_busuk_db` beserta tabel-tabelnya.

#### Untuk Windows Command Prompt (CMD) atau Linux/macOS:
```bash
mysql -u root < backend/sql/schema.sql
```

#### Untuk Windows PowerShell (Buka terminal dari folder `ficky-busuk/`):
```powershell
Get-Content backend\sql\schema.sql | mysql -u root
```

*Catatan: Jika MySQL Anda memiliki password, tambahkan flag `-p` di akhir perintah di atas (misal: `mysql -u root -p`).*

### 5. Jalankan Database Seeder

Seeder akan mengisi data awal berupa akun admin default, 8 layanan klinik hewan, 4 dokter hewan praktek, dan 3 ulasan testimoni.

Masuk ke folder `backend/` lalu jalankan:
```bash
npm run seed
```

**Informasi Login Admin Default:**
- **Email**: `admin@fickybusuk.com`
- **Password**: `admin123`

### 6. Jalankan Server Backend

Masuk ke folder `backend/` lalu jalankan server dalam mode pengembangan (nodemon):
```bash
npm run dev
```
Server backend akan berjalan di **`http://localhost:5000`**.

### 7. Jalankan Server Frontend (React + Vite)

Buka terminal baru di root folder (`ficky-busuk/`) lalu jalankan:
```bash
npm run dev
```
Aplikasi web frontend akan berjalan di **`http://localhost:5173`**. Buka tautan tersebut di peramban (browser) Anda.

---

## Keterangan Penggunaan Aplikasi

### Role Pengunjung / Customer (Tanpa Login):
- Melihat Halaman Landing, Tentang Kami, Layanan, dan Jadwal Operasional Klinik.
- Melakukan Reservasi Pemeriksaan Hewan secara online melalui form pemesanan (Tanggal kunjungan divalidasi tidak boleh di masa lalu).
- Mengirim pesan konsultasi / hubungi kami yang tersimpan ke database.

### Role Admin:
- Login menggunakan email `admin@fickybusuk.com` dan password `admin123`.
- Memantau ringkasan statistik (pendapatan, jumlah kunjungan, status pendaftaran).
- Melakukan CRUD (Tambah, Edit, Hapus) layanan klinik, dokter hewan, dan ulasan testimoni.
- Mengubah status pendaftaran pasien (Pending, Approved, Completed, Cancelled).
- Mengelola pencatatan kasir pembayaran (Unpaid, Paid, Refunded) bersangkutan dengan pendaftaran pasien.
- Membaca pesan konsultasi masuk dan menandainya sebagai telah dibaca, atau langsung membalas pelanggan via shortcut chat WhatsApp.
- Logout dari panel pengelola.
