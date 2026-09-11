# 📑 Rekap Progres Pengembangan Sistem Absensi SUCOFINDO

Dokumen ini memuat rangkuman lengkap mengenai arsitektur, implementasi backend, integrasi frontend, dan status terkini aplikasi.

---

## 1. 🏗️ Arsitektur & Lingkup Sistem

Sistem ini dirancang untuk melayani **3 platform akses**:

```
                              ┌────────────────────────┐
                              │  Sistem Absensi PTT    │
                              │       SUCOFINDO        │
                              └───────────┬────────────┘
                                          │
        ┌─────────────────────────────────┼─────────────────────────────────┐
        │                                 │                                 │
        ▼                                 ▼                                 ▼
┌────────────────┐               ┌────────────────┐               ┌────────────────┐
│   Web Admin    │               │  Web Employee  │               │   Mobile App   │
│ (React/Inertia)│               │ (React/Inertia)│               │ (Sanctum API)  │
└────────────────┘               └────────────────┘               └────────────────┘
```

1. **Web Admin**: Dashboard metrik, CRUD Karyawan (fokus NIK), Penugasan Proyek & Bidang Magang, Monitoring Kehadiran (Filter Rentang Tanggal, Export Rekap CSV, Detail Drawer Sheet, & Master Hari Libur), Monitoring Lembur, Rekap Laporan & Export.
2. **Web Employee & Intern**: Dashboard Pegawai, Check-in/Check-out harian via Web dengan GPS & Foto, Pengajuan Lembur (khusus Karyawan PTT), Riwayat Kehadiran, Profil.
3. **Mobile App (API)**: Endpoint Sanctum siap pakai untuk pengembangan aplikasi mobile Android/iOS di tahap berikutnya.

---

## 2. 👥 Matriks Hak Akses & Pembagian Penugasan

| Fitur / Modul | Admin (`admin`) | Karyawan PTT (`employee`) | Mahasiswa Magang (`intern`) |
| :--- | :---: | :---: | :---: |
| **Login & Dashboard Admin** | ✅ | ❌ | ❌ |
| **Manajemen Pegawai & Reset Password** | ✅ | ❌ | ❌ |
| **Penugasan Kerja** | Kelola Semua | Ditugaskan ke **Proyek** (misal: PIK-2026) | Ditempatkan ke **Bidang** (LSI, DukBis, BIT, KSP) |
| **Pencegahan Absensi Weekend/Libur** | — | ✅ (Berlaku) | ✅ (Berlaku) |
| **Absensi Masuk (Check-In) Foto & GPS** | ❌ | ✅ | ✅ |
| **Absensi Pulang (Check-Out) & Catatan** | ❌ | ✅ | ✅ |
| **Pengajuan Lembur (Overtime)** | Approval/Monitor | ✅ | ❌ *(Diblokir 403 & Menu Disembunyikan)* |
| **Monitoring Kehadiran & Master Hari Libur** | ✅ (Filter Date Range, Export, Tambah & Hapus Libur) | ❌ | ❌ |

---

## 3. ⚙️ Backend (Laravel 12 / PHP 8.2)

### a. Database Models & Relasi
| Model | Deskripsi & Aturan Bisnis |
| :--- | :--- |
| `User` | Autentikasi utama, role (`admin` / `employee` / `intern`), status `is_active`, flag `must_change_password`. |
| `Employee` | Profil data diri karyawan & magang: NIK (pengenal tunggal), `division` (Bidang: LSI, DukBis, BIT, KSP untuk anak magang), nomor telepon. |
| `Holiday` | Master hari libur nasional (SKB 3 Menteri) & libur internal perusahaan untuk validasi absensi harian. |
| `Attendance` | Log absensi harian (check-in/out time, tipe WFO/WFA, foto bukti, GPS lat/long, catatan kerja). |
| `Overtime` | Pengajuan lembur mandiri (tanggal, jam mulai-selesai, durasi, status approval). Khusus `employee`. |
| `Project` | Master data proyek (nama, kode unik, rentang tanggal, deskripsi, status aktif). |
| `EmployeeProject` | Pivot penugasan proyek (*Constraint*: 1 karyawan hanya boleh punya 1 proyek aktif di satu waktu). |
| `Setting` | Konfigurasi sistem dinamis (misal: batas jam lembur harian). |
| `PasswordChangeLog` | Audit trail riwayat reset/penggantian kata sandi. |

### b. Validasi Form Request Terpusat
* `StoreEmployeeRequest` & `UpdateEmployeeRequest`: Validasi nama, NIK (unik), email (unik), role (`employee`/`intern`), `division` (wajib untuk role intern: `in:LSI,DukBis,BIT,KSP`), telepon, dan proyek.
* `CheckInRequest`: 
  * ❌ Otomatis **menolak absensi** jika hari ini adalah **Sabtu atau Minggu (Weekend)**.
  * ❌ Otomatis **menolak absensi** jika hari ini terdaftar di tabel **`holidays` (Hari Libur Nasional/Perusahaan)**.
  * Validasi tipe kerja (WFO/WFA), file foto (maks 5MB), koordinat GPS, dan anti-duplikasi absensi.
* `CheckOutRequest`: Validasi catatan kerja wajib diisi dan verifikasi status check-in hari ini.
* `OvertimeStoreRequest`: Memeriksa bahwa user berhak lembur (`canOvertime()`) dan menolak `intern`.

### c. Controller Logic
* **Admin**:
  * `AttendanceController`: Filter rentang tanggal (`start_date` & `end_date`), pencarian (`search`), 4 metrik KPI (Hadir, Clock In, Clock Out, Status Hari Ini), integrasi data tabel dan master hari libur.
  * `HolidayController`: Menambah dan menghapus hari libur kerja dari master sistem.
  * `ReportController`: Rekap & ekspor CSV kehadiran dengan filter rentang tanggal dan pencarian.
  * `EmployeeController`, `EmployeePasswordController`, `DashboardController`, `ProjectController`, `AssignmentController`, `OvertimeController`.
* **Employee**:
  * `CheckInController`, `CheckOutController`, `OvertimeController` *(Guard Intern)*, `DashboardController`, `HistoryController`, `ProfileController`.

---

## 4. 🖥️ Frontend & Integrasi (React / Inertia.js / TypeScript)

### a. Monitoring Kehadiran & Master Hari Libur (`resources/js/pages/admin/attendance/index.tsx`)
* **Header & Tombol Aksi**:
  * Tombol **`Daftar Hari Libur (20)`**: Membuka modal daftar hari libur lengkap dengan opsi hapus.
  * Tombol **`+ Tambah Hari Libur`**: Membuka modal form penambahan hari libur baru.
* **4 Summary Metrics**: Hadir Hari Ini, Clock In, Clock Out, Status Kalender Hari Ini (Kerja vs Libur/Weekend).
* **Filter Bar**:
  * Filter **Start Date** & **End Date** dengan calendar picker.
  * Filter **Pencarian** (Nama, NIK, Proyek, atau Bidang).
  * Tombol **Reset Filter** & **Terapkan Filter**.
* **Tabel Data Kehadiran**:
  * Tombol **Export Recap** (langsung mengunduh CSV berdasarkan filter tanggal & pencarian).
  * Kolom: Karyawan (Avatar, Nama, NIK, Badge Magang jika intern), Proyek / Bidang (Badge Bidang untuk Magang vs Nama Proyek untuk Karyawan), Clock In (indikator merah jika terlambat), Clock Out, Mode (WFO/WFA), dan Tombol Aksi View.
* **Drawer Sheet Detail Kehadiran**:
  * Panel samping interaktif menampilkan: Profil Pegawai, Status Present/Absent, Ringkasan Clock In/Out 12h & Total Jam Kerja, Timeline Aktivitas, Verifikasi Lokasi GPS (link Google Maps) & Foto Presensi, serta Catatan Kerja Harian.

---

## 5. 🔑 Akun Uji Coba & Seeder (Testing Credentials)

| Role | Email | Password | Keterangan |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@sucofindo.com` | `admin123` | Akses penuh dashboard admin & monitoring kehadiran |
| **Karyawan PTT** | `karyawan@sucofindo.com` | `123` | Karyawan utama (Proyek PIK-2026, Bisa Absen & Lembur) |
| **Mahasiswa Magang** | `magang@sucofindo.com` | `123` | Mahasiswa Magang (Bidang BIT, Hanya Absen Masuk/Pulang) |
| **Employee 2** | `siti.rahma@sucofindo.com` | `123` | Karyawan PTT (Proyek SIPS-2026) |
| **Employee 3** | `ahmad.fauzi@sucofindo.com` | `123` | Karyawan PTT (Proyek PLJ-2026) |
| **Employee 4** | `dewi.lestari@sucofindo.com` | `123` | Karyawan PTT (Proyek PIK-2026) |
| **Employee 5** | `rizky.pratama@sucofindo.com` | `123` | Karyawan PTT (Status Inactive) |

---

## 6. 🚀 Status Kompilasi & Build

* **Frontend Build**: `npm run build` berjalan sukses (**0 errors, 0 warnings**).
