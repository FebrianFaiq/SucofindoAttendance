# Dokumen Kebutuhan Produk (PRD)
## SUCOFINDO Attendance Management System

**Status Dokumen:** ✅ **APPROVED — v1.0 (FINAL)**
**Versi:** 1.0

> Dokumen ini adalah revisi final dari draft v0.3 (Full), disusun berdasarkan seluruh keputusan yang telah dikonfirmasi. Dokumen ini siap digunakan sebagai acuan resmi untuk tahap System Design & Development, dan disusun agar dapat direview oleh Software Architect, Product Manager, dan Mentor.

---

## 1. Informasi Dokumen

| Field | Detail |
|---|---|
| Judul Dokumen | SUCOFINDO Attendance Management System – Product Requirements Document |
| Tipe Dokumen | PRD Final |
| Versi | 1.0 |
| Status | **Approved — Final** (konten requirement telah difiksasi; field administratif seperti nama penyetuju diisi manual sebelum distribusi resmi) |
| Disusun Oleh | *[Nama Intern PKL]* |
| Direview Oleh | *[Nama Mentor / Software Architect]* |
| Disetujui Oleh (Sign-off) | *[Nama Project Sponsor / HRD]* |
| Tanggal Dibuat | 29 Juli 2026 |
| Tanggal Final | 31 Juli 2026 |
| Kerahasiaan | Internal Use Only — SUCOFINDO |

---

## 2. Riwayat Versi

| Versi | Tanggal | Deskripsi Perubahan |
|---|---|---|
| 0.1 | 29 Juli 2026 | Draft awal berdasarkan requirement gathering awal. Sebagian besar item "Perlu Konfirmasi". |
| 0.2 | 29 Juli 2026 | Update pasca sesi konfirmasi: login via email, WFO/WFA, foto+GPS wajib, tanpa alur cuti, catatan kerjaan saat checkout, jam kerja fleksibel dengan flag admin. |
| 0.3 | 30 Juli 2026 | Tambahan requirement HRD: absen lembur (input manual), database via clone dari pusat, format export CSV/Excel, rekap bulanan per karyawan. |
| 0.3 (Full) | 30 Juli 2026 | Konsolidasi seluruh isi v0.1–v0.3 dalam satu dokumen, kode FR dirapikan per modul. |
| **1.0 (Final)** | 31 Juli 2026 | **Revisi final pasca rapat fiksasi.** Penyempitan scope ke Karyawan PTT/Proyek, autentikasi dikelola Admin (tanpa self-register, wajib ganti password di login pertama), fitur Manajemen Karyawan & Penugasan Proyek, penyederhanaan konsep Flag, kelengkapan Lembur (start/end time), Dashboard dengan KPI card & filter, Export dengan filter lengkap, keputusan arsitektur (monorepo), dan Out of Scope yang lebih tegas. Status dokumen naik dari Draft menjadi **Approved v1.0**. |

---

## 3. Gambaran Umum Proyek

SUCOFINDO mengembangkan **Attendance Management System** internal khusus untuk **Karyawan PTT / Karyawan Proyek (Project Employees)**. Sistem ini **tidak ditujukan untuk seluruh karyawan SUCOFINDO** — karyawan tetap (permanent employees) sudah menggunakan sistem absensi terpisah yang disediakan oleh kantor pusat, dan tetap berada di luar cakupan sistem ini.

Sistem terdiri dari tiga komponen:

- **Aplikasi mobile** (Flutter) — untuk Karyawan PTT/Proyek
- **Aplikasi web** (Laravel) — untuk Karyawan PTT/Proyek
- **Dashboard web administrator** (Laravel) — untuk Admin/HRD

Backend menggunakan Laravel dan menyediakan REST API untuk aplikasi mobile. Seluruh komponen (backend, web admin, dan referensi API untuk mobile) dikelola dalam **arsitektur monorepo**. Data karyawan bersumber dari database pusat melalui proses **clone**, bukan koneksi real-time langsung.

| Item | Detail |
|---|---|
| Nama Proyek | SUCOFINDO Attendance Management System |
| Target Pengguna | Karyawan PTT / Karyawan Proyek (**bukan** karyawan tetap) |
| Tipe Proyek | Aplikasi Enterprise Internal, arsitektur monorepo |
| Durasi | 2 Bulan |
| Arsitektur | Monorepo — Backend Laravel, Web Admin Laravel, Mobile Flutter (konsumsi REST API) |

---

## 4. Latar Belakang Bisnis

Ada tiga pendorong bisnis utama di balik proyek ini:

1. **Segmentasi kebutuhan absensi berdasarkan status kepegawaian.** Karyawan tetap SUCOFINDO sudah memiliki sistem absensi resmi dari kantor pusat, sehingga tidak perlu — dan tidak dimaksudkan — untuk masuk ke dalam cakupan sistem ini. Sistem ini secara khusus dibangun untuk mengakomodasi Karyawan PTT/Proyek, yang sebelumnya tidak memiliki sistem pencatatan kehadiran yang memadai untuk kebutuhan mereka (termasuk keterkaitan dengan penugasan proyek).
2. **Kebutuhan pengelolaan penugasan proyek.** Karyawan PTT/Proyek bekerja dalam konteks proyek tertentu yang dapat berubah dari waktu ke waktu, sehingga data kehadiran perlu terhubung dengan penugasan proyek yang berlaku, dikelola sepenuhnya oleh Admin.
3. **Kebutuhan HRD memonitor jam lembur.** HRD membutuhkan visibilitas terhadap siapa yang lembur, berapa lama, dan kapan durasi lembur seorang karyawan melebihi ambang batas yang dikonfigurasi — murni untuk keperluan pendataan/monitoring, tanpa alur persetujuan (lembur tidak melalui proses approval).

Sifat pekerjaan Karyawan PTT/Proyek juga **fleksibel** — tidak ada batasan waktu masuk/keluar kerja yang ketat. Sistem mencatat kehadiran secara akurat (foto + GPS) tanpa memaksakan jam kerja kaku, dan memberikan indikator sederhana ("flag") di sisi Admin untuk kondisi tertentu seperti keterlambatan.

---

## 5. Pernyataan Masalah (Problem Statement)

> SUCOFINDO belum memiliki sistem absensi khusus untuk Karyawan PTT/Proyek yang mampu: (1) memvalidasi kehadiran secara akurat melalui foto dan GPS, (2) mengakomodasi jam kerja fleksibel tanpa membatasi karyawan, (3) mengaitkan data kehadiran dengan penugasan proyek yang dikelola terpusat oleh Admin, (4) mencatat lembur secara manual untuk keperluan pendataan HRD dengan alert saat melebihi ambang batas, dan (5) memberikan visibilitas real-time melalui dashboard ringkas kepada Admin/HRD — sementara karyawan tetap sudah terlayani oleh sistem terpisah dari kantor pusat.

---

## 6. Tujuan & Sasaran (Goals & Objectives)

| # | Tujuan |
|---|---|
| 1 | Menyediakan sistem absensi khusus untuk Karyawan PTT/Proyek, terpisah dari sistem karyawan tetap |
| 2 | Menyediakan cara yang andal bagi karyawan untuk check-in dan check-out via mobile dan web, dengan validasi foto dan GPS |
| 3 | Mengelola akun karyawan sepenuhnya melalui Admin (tanpa self-registration), dengan keamanan wajib ganti password di login pertama |
| 4 | Mengaitkan data kehadiran dan lembur dengan penugasan proyek karyawan yang berlaku, dikelola oleh Admin |
| 5 | Mengakomodasi sifat kerja fleksibel tanpa membatasi jam masuk/keluar karyawan |
| 6 | Memberikan indikator (flag) sederhana bagi Admin untuk memantau status kehadiran harian tanpa kompleksitas sistem status yang berat |
| 7 | Menyediakan mekanisme pencatatan lembur manual untuk keperluan pendataan dan monitoring HRD, lengkap dengan alert saat melebihi ambang batas |
| 8 | Memberikan Admin dashboard ringkas berbasis KPI dan tabel kehadiran yang dapat difilter |
| 9 | Menyediakan kemampuan export rekap kehadiran (CSV/Excel) yang dapat difilter per karyawan, proyek, dan tanggal |
| 10 | Menjaga UI/UX tetap simple dan compact, tidak meribetkan pengguna |
| 11 | Memastikan data karyawan tetap tersedia melalui mekanisme clone database dari kantor pusat |

---

## 7. Ruang Lingkup Proyek

### 7.1 Target Pengguna

> **Sistem ini secara eksklusif ditujukan untuk Karyawan PTT / Karyawan Proyek.** Karyawan tetap (permanent employees) **tidak** menjadi pengguna sistem ini karena sudah memiliki sistem absensi resmi dari kantor pusat. Batasan ini berlaku untuk seluruh fitur di bawah — termasuk data yang di-clone dari database pusat, yang hanya mencakup data Karyawan PTT/Proyek yang relevan bagi sistem ini.

### 7.2 Dalam Ruang Lingkup

| # | Fitur | Detail |
|---|---|---|
| 1 | Login via Email + Password | Autentikasi karyawan dan Admin menggunakan email, **tanpa self-registration** |
| 2 | Akun Dikelola Admin | Akun karyawan dibuat/diimpor oleh Admin, bukan didaftarkan sendiri oleh karyawan |
| 3 | Wajib Ganti Password di Login Pertama | Karyawan tidak dapat mengakses fitur absensi sebelum password diganti |
| 4 | Reset & Ubah Password oleh Admin | Admin dapat mereset atau mengubah password karyawan secara manual |
| 5 | Manajemen Karyawan | Admin dapat menambah, mengedit, menonaktifkan/menghapus data karyawan |
| 6 | Penugasan Proyek | Admin mengelola penugasan proyek karyawan (assign & reassign); karyawan tidak memilih proyek sendiri |
| 7 | Absensi Otomatis Mengikuti Proyek Aktif | Data check-in/check-out & lembur otomatis mengacu ke proyek aktif karyawan |
| 8 | Absensi via Web & Mobile | Karyawan dapat Check In/Check Out dari kedua kanal |
| 9 | Foto + GPS + WFO/WFA | Wajib pada setiap Check In dan Check Out |
| 10 | Jam Kerja Fleksibel | Tidak ada batasan waktu wajib; keterlambatan (setelah 08:00) tidak pernah ditolak, hanya memicu flag ke Admin |
| 11 | Catatan Kerjaan Harian | Wajib diisi karyawan saat Check Out |
| 12 | Flag Sederhana | Indikator visual ringan di sisi Admin (bukan sistem status berbasis database yang berat) |
| 13 | Absen Lembur Manual | Karyawan input tanggal, jam mulai, jam selesai, durasi, dan keterangan lembur |
| 14 | Alert Ambang Batas Lembur | Sistem mengalert HRD saat akumulasi lembur karyawan melebihi ambang batas yang dikonfigurasi |
| 15 | Dashboard Admin dengan KPI Card | Total Karyawan, Hadir Hari Ini, WFO Hari Ini, WFA Hari Ini, Belum Check In, Belum Check Out, Lembur Hari Ini |
| 16 | Filter Dashboard & Tabel Kehadiran | Filter berdasarkan Tanggal, Karyawan, dan Proyek |
| 17 | Tabel Kehadiran Admin | Kolom: Karyawan, Proyek, Jam Masuk, Jam Keluar, Status Kehadiran, WFO/WFA, Lembur |
| 18 | Export Rekap | Format CSV dan Excel, rekap bulanan, dapat difilter per Karyawan, Proyek, dan Tanggal |
| 19 | Database via Clone | Data karyawan bersumber dari clone database kantor pusat |
| 20 | Prinsip Desain | UI simple dan compact |

### 7.3 Di Luar Ruang Lingkup

Lihat Section 8.

---

## 8. Di Luar Ruang Lingkup (Out of Scope)

Item berikut **secara eksplisit dikonfirmasi tidak masuk** dalam ruang lingkup PRD v1.0:

| # | Item | Keterangan |
|---|---|---|
| 1 | Alur Perizinan / Leave Request | Tidak dikembangkan |
| 2 | Permission Workflow | Tidak dikembangkan |
| 3 | Kalender Hari Libur (Holiday Calendar) | Tidak dikembangkan |
| 4 | QR Code Attendance | Tidak dikembangkan |
| 5 | Face Recognition | Tidak dikembangkan (validasi kehadiran cukup melalui foto manual + GPS) |
| 6 | Advanced Analytics | Tidak dikembangkan pada versi ini |
| 7 | Push Notification | Tidak dikembangkan; alert (mis. lembur berlebih) ditampilkan di dashboard, bukan melalui notifikasi push |
| 8 | Alur Approval Lembur | Lembur bersifat pendataan/monitoring saja, **tanpa proses persetujuan** |
| 9 | Absensi untuk Karyawan Tetap | Di luar cakupan — karyawan tetap menggunakan sistem terpisah dari kantor pusat |

> **Catatan:** Item yang sebelumnya berstatus "Perlu Konfirmasi" pada draft v0.3 namun tidak dibahas ulang pada sesi fiksasi final (misalnya Audit Log dan Shift Schedule) **dianggap belum masuk scope v1.0** dan dipindahkan ke Section 18 (Future Enhancements), bukan dikembangkan pada rilis ini.

---

## 9. Stakeholder

| Peran | Nama | Tanggung Jawab |
|---|---|---|
| Project Sponsor | *[Perlu diisi]* | Pemilik bisnis, persetujuan akhir |
| Product Owner / Mentor | *[Perlu diisi]* | Validasi requirement, prioritisasi |
| Tim IT / Development | *[Intern PKL]* | Merancang, membangun, dan menguji sistem |
| Departemen HRD | *[Perlu diisi]* | Sumber requirement lembur & monitoring; pengguna dashboard rekap |
| End User – Karyawan | Karyawan PTT / Karyawan Proyek SUCOFINDO | Menggunakan sistem untuk absensi harian & lembur |
| End User – Administrator | *[Perlu diisi departemen]* | Mengelola karyawan, penugasan proyek, dan memantau data kehadiran/lembur |

> **Asumsi (lihat Section 14):** Pada versi 1.0 ini, peran **Administrator dan HRD diasumsikan menggunakan panel yang sama** (satu role "Administrator" yang mencakup fungsi manajemen karyawan/proyek maupun monitoring HRD), kecuali dinyatakan lain oleh mentor pada tahap desain teknis.

---

## 10. User Roles / Persona

### 10.1 Karyawan (Employee) — PTT / Karyawan Proyek

| Atribut | Detail |
|---|---|
| Cakupan Pengguna | Hanya Karyawan PTT/Proyek — **karyawan tetap tidak menggunakan sistem ini** |
| Pembuatan Akun | **Tidak bisa self-register.** Akun dibuat/diimpor oleh Admin |
| Login Pertama | Wajib ganti password sebelum dapat mengakses fitur apa pun selain layar ganti password |
| Kanal Akses | Web, Mobile |
| Penugasan Proyek | Ditentukan oleh Admin; karyawan **tidak memilih proyek saat absen** — sistem otomatis mengacu ke proyek aktif |
| Aksi Absensi Harian | Check In, Check Out — pilih WFO/WFA, ambil foto, ambil GPS |
| Catatan Kerjaan | Wajib diisi saat Check Out |
| Batasan Waktu | Tidak ada — kerja fleksibel; keterlambatan tidak pernah ditolak |
| Input Absen Lembur | Mengisi tanggal, jam mulai, jam selesai, durasi, keterangan — manual, bukan timestamp otomatis |
| Riwayat | Melihat riwayat kehadiran & lembur miliknya sendiri |
| Profil | Melihat informasi profil (nama, email, proyek yang sedang berjalan) |

### 10.2 Administrator (mencakup fungsi HRD)

| Atribut | Detail |
|---|---|
| Login | Email + password |
| Manajemen Karyawan | Tambah, edit, nonaktifkan/hapus karyawan; reset/ubah password karyawan |
| Manajemen Penugasan Proyek | Assign & reassign proyek karyawan; mendukung satu proyek aktif, dapat berpindah proyek, dan sesekali memiliki lebih dari satu proyek aktif sekaligus |
| Dashboard | KPI card (Total Karyawan, Hadir Hari Ini, WFO/WFA Hari Ini, Belum Check In/Out, Lembur Hari Ini) |
| Filter | Berdasarkan Tanggal, Karyawan, Proyek |
| Tabel Kehadiran | Karyawan, Proyek, Jam Masuk, Jam Keluar, Status Kehadiran, WFO/WFA, Lembur |
| Monitoring Lembur | Melihat seluruh entri lembur karyawan dan menerima alert saat melebihi ambang batas yang dikonfigurasi |
| Export | CSV/Excel, rekap bulanan, filter per Karyawan/Proyek/Tanggal |

---

## 11. Kebutuhan Fungsional (Functional Requirements)

> Setiap FR dilengkapi **acceptance criteria** untuk memudahkan tim development dan QA memvalidasi implementasi. Kode FR menggunakan modul: **FR-AUTH** (autentikasi), **FR-EMP** (manajemen karyawan), **FR-PROJ** (proyek), **FR-ATT** (absensi harian), **FR-FLAG** (indikator status), **FR-OVT** (lembur), **FR-ADM** (dashboard admin), **FR-EXP** (export), **FR-SYS** (sistem/infrastruktur data).

### 11.1 Autentikasi (FR-AUTH)

**FR-AUTH-01 — Login Email + Password**
Karyawan dan Admin login menggunakan email dan password terdaftar. Tidak ada opsi self-registration di mana pun dalam sistem.
*Acceptance Criteria:*
- Login berhasil hanya dengan kombinasi email + password yang valid.
- Kombinasi salah menampilkan pesan error generik (tidak menyebutkan field mana yang salah).
- Tidak tersedia tombol/link "Daftar Akun Baru" di layar manapun.

**FR-AUTH-02 — Wajib Ganti Password di Login Pertama**
Karyawan yang login menggunakan password awal/sementara dari Admin wajib menggantinya sebelum dapat menggunakan fitur lain.
*Acceptance Criteria:*
- Setelah login pertama berhasil, sistem otomatis mengarahkan ke layar "Ganti Password" dan tidak dapat dilewati.
- Karyawan tidak dapat mengakses Check In, Check Out, Riwayat, Lembur, atau Profil sebelum password berhasil diganti.
- Setelah password berhasil diganti, karyawan diarahkan ke Dashboard/Home.
- Aturan kompleksitas password minimum mengikuti kebijakan yang ditentukan pada tahap desain teknis (lihat Section 19).

**FR-AUTH-03 — Reset Password oleh Admin**
Admin dapat mereset password karyawan tertentu dari halaman Manajemen Karyawan.
*Acceptance Criteria:*
- Reset menghasilkan password sementara baru dan menandai akun agar wajib ganti password di login berikutnya (terhubung dengan FR-AUTH-02).

**FR-AUTH-04 — Ubah Password Manual oleh Admin**
Admin dapat menetapkan password baru secara langsung untuk karyawan tertentu.
*Acceptance Criteria:*
- Admin dapat memasukkan nilai password baru untuk satu karyawan dari halaman detail karyawan.
- Disarankan (praktik baik, bukan fitur Audit Log formal) agar sistem mencatat kapan dan oleh siapa perubahan password dilakukan, sebagai data teknis internal.

### 11.2 Manajemen Karyawan (FR-EMP)

**FR-EMP-01 — Tambah Karyawan**
Admin dapat membuat akun karyawan baru.
*Acceptance Criteria:*
- Admin mengisi data minimum: Nama, Email, ID Karyawan, dan proyek awal (opsional saat pembuatan, bisa ditambahkan kemudian melalui FR-EMP-04).
- Sistem membuat password awal/sementara dan menandai akun agar wajib ganti password (FR-AUTH-02).

**FR-EMP-02 — Edit Karyawan**
Admin dapat memperbarui data dasar karyawan (nama, email, ID karyawan, status aktif/nonaktif).

**FR-EMP-03 — Nonaktifkan / Hapus Karyawan**
Admin dapat menonaktifkan (soft-disable) atau menghapus data karyawan.
*Acceptance Criteria:*
- Karyawan berstatus nonaktif tidak dapat login.
- Mekanisme pasti (nonaktif/soft-delete vs. hapus permanen/hard-delete) mengikuti keputusan teknis pada Section 19.

**FR-EMP-04 — Assign Karyawan ke Proyek**
Admin dapat menugaskan satu atau lebih karyawan ke sebuah proyek.
*Acceptance Criteria:*
- Admin dapat menandai proyek tertentu sebagai "aktif" untuk seorang karyawan.
- Sistem mendukung kasus di mana karyawan memiliki lebih dari satu proyek aktif secara bersamaan (lihat catatan pada FR-PROJ-02).

**FR-EMP-05 — Ubah Penugasan Proyek Karyawan**
Admin dapat memindahkan karyawan dari satu proyek ke proyek lain.
*Acceptance Criteria:*
- Riwayat penugasan proyek sebelumnya tetap tersimpan dan dapat ditelusuri untuk kebutuhan pelaporan (kolom "Proyek" pada riwayat kehadiran & export tetap akurat sesuai proyek yang berlaku saat absensi terjadi).

### 11.3 Penugasan Proyek (FR-PROJ)

**FR-PROJ-01 — Data Master Proyek**
Sistem menyediakan data proyek yang dapat dipilih Admin saat melakukan penugasan.
*Acceptance Criteria:*
- Admin dapat melihat daftar proyek yang tersedia untuk ditugaskan ke karyawan.
- Sumber data proyek (dibuat manual oleh Admin, atau ikut di-clone dari database pusat bersama data karyawan) mengikuti keputusan teknis pada Section 19.

**FR-PROJ-02 — Auto-Tagging Proyek pada Absensi & Lembur**
Setiap Check In, Check Out, dan entri lembur otomatis ditandai dengan proyek aktif karyawan yang bersangkutan. Karyawan tidak pernah memilih proyek secara manual saat melakukan absensi.
*Acceptance Criteria:*
- Kolom "Proyek" pada tabel kehadiran, riwayat, dan hasil export terisi otomatis berdasarkan penugasan proyek yang berlaku.
- **Catatan penting:** untuk kasus karyawan dengan lebih dari satu proyek aktif secara bersamaan, aturan penentuan proyek mana yang di-tag pada satu entri absensi/lembur **belum ditentukan secara eksplisit** dan dicatat sebagai asumsi terbuka pada Section 14 — perlu diklarifikasi sebelum tahap desain teknis.

### 11.4 Absensi Harian (FR-ATT)

**FR-ATT-01 — Check In (Mobile & Web)**
*Acceptance Criteria:*
- Karyawan memilih status WFO atau WFA sebagai bagian dari proses check-in.
- Karyawan wajib mengambil foto melalui kamera perangkat.
- Sistem wajib menangkap koordinat GPS karyawan.
- Check-in dapat dilakukan kapan saja tanpa batasan waktu wajib.
- Jika waktu check-in **lebih dari pukul 08:00**, record ditandai "Terlambat" untuk keperluan flag Admin (lihat FR-FLAG-01) — **submission tetap berhasil, tidak pernah ditolak**.
- Percobaan check-in kedua di hari yang sama menampilkan notifikasi "Sudah Check In Hari Ini" tanpa membuat record baru.

**FR-ATT-02 — Check Out (Mobile & Web)**
*Acceptance Criteria:*
- Karyawan wajib mengambil foto dan sistem wajib menangkap GPS, sama seperti Check In.
- Kolom Catatan Kerjaan Harian **wajib diisi** — submit ditolak (validasi form, bukan penolakan bisnis) jika kolom kosong.
- Check-out hanya dapat dilakukan jika karyawan sudah check-in pada hari tersebut dan belum check-out.

**FR-ATT-03 — Riwayat Kehadiran (Employee)**
*Acceptance Criteria:*
- Karyawan dapat melihat riwayat kehadirannya sendiri, mencakup tanggal, jam masuk/keluar, proyek, status WFO/WFA, dan catatan kerjaan.

**FR-ATT-04 — Profil Karyawan**
*Acceptance Criteria:*
- Karyawan dapat melihat nama, email, dan proyek yang sedang berjalan.
- Kemampuan edit profil mandiri oleh karyawan: **Perlu Konfirmasi** (tidak dibahas pada sesi final; lihat Section 18).

### 11.5 Indikator Status (FR-FLAG)

**FR-FLAG-01 — Flag Kehadiran Sederhana**
Flag berfungsi sebagai alat bantu visual bagi Admin untuk memantau kehadiran secara cepat, **bukan sistem status berbasis database yang kompleks.**
*Acceptance Criteria:*
- Sistem menampilkan label sederhana per karyawan per hari, minimal mencakup: "Belum Check In", "Sudah Check In", "Sudah Check Out", "WFO", "WFA", dan "Terlambat" (jika check-in setelah 08:00).
- Flag dihitung/ditampilkan secara langsung dari data absensi yang ada (mis. dari timestamp dan status kolom sederhana), **tanpa** tabel riwayat status terpisah yang rumit.
- Flag bersifat informatif — tidak pernah memblokir aksi karyawan.

### 11.6 Lembur (FR-OVT)

**FR-OVT-01 — Input Absen Lembur**
Karyawan mengisi form lembur secara manual, terpisah dari Check In/Check Out biasa.
*Acceptance Criteria:*
- Field yang diisi: Tanggal, Jam Mulai, Jam Selesai, Durasi, dan Keterangan pekerjaan lembur.
- Tidak ada validasi foto, GPS, atau timestamp otomatis untuk entri ini — murni input manual.
- Entri lembur otomatis ditandai dengan proyek aktif karyawan (FR-PROJ-02).
- *Catatan desain:* hubungan antara field Durasi dengan Jam Mulai/Jam Selesai (dihitung otomatis vs. diisi independen untuk kasus non-standar) agar dikonfirmasi pada tahap desain UI.

**FR-OVT-02 — Daftar & Monitoring Lembur (Admin/HRD)**
*Acceptance Criteria:*
- Admin/HRD dapat melihat daftar seluruh entri lembur karyawan: nama, proyek, tanggal, jam mulai/selesai, durasi, keterangan.
- **Tidak ada alur persetujuan (approval)** — entri lembur tercatat otomatis begitu karyawan submit, murni untuk keperluan pendataan/monitoring HRD.

**FR-OVT-03 — Alert Ambang Batas Lembur**
*Acceptance Criteria:*
- Sistem menyediakan pengaturan ambang batas lembur yang dapat dikonfigurasi oleh Admin/HRD (nilai default dan periode akumulasi — harian/mingguan/bulanan — ditentukan pada tahap desain teknis, lihat Section 19).
- Ketika akumulasi jam lembur seorang karyawan melebihi ambang batas yang dikonfigurasi, sistem menampilkan alert kepada Admin/HRD (di dashboard, sesuai batasan Section 8 yang mengecualikan push notification).

### 11.7 Dashboard Admin (FR-ADM)

**FR-ADM-01 — KPI Card Dashboard**
*Acceptance Criteria:*
Dashboard menampilkan tujuh KPI card berikut, terhitung untuk tanggal yang dipilih (default: hari ini):
- Total Karyawan
- Hadir Hari Ini
- WFO Hari Ini
- WFA Hari Ini
- Belum Check In
- Belum Check Out
- Lembur Hari Ini

**FR-ADM-02 — Filter Dashboard & Tabel Kehadiran**
*Acceptance Criteria:*
- Admin dapat memfilter data dashboard dan tabel kehadiran berdasarkan Tanggal, Karyawan, dan Proyek, baik sendiri-sendiri maupun kombinasi.

**FR-ADM-03 — Tabel Kehadiran Admin**
*Acceptance Criteria:*
- Tabel menampilkan kolom: Karyawan, Proyek, Jam Masuk, Jam Keluar, Status Kehadiran (flag, lihat FR-FLAG-01), WFO/WFA, dan Lembur (indikator ada/tidaknya entri lembur pada hari tersebut).
- Tabel dapat difilter sesuai FR-ADM-02.

### 11.8 Export (FR-EXP)

**FR-EXP-01 — Export Rekap Kehadiran**
*Acceptance Criteria:*
- Admin dapat mengekspor rekap kehadiran dalam format **CSV** atau **Excel**.
- Rekap mendukung tampilan **bulanan**.
- Export dapat difilter berdasarkan Karyawan, Proyek, dan Tanggal (rentang).
- Kolom spesifik dalam file export mengikuti struktur tabel kehadiran (FR-ADM-03) sebagai baseline, dengan detail final ditentukan pada tahap desain teknis.

### 11.9 Sistem & Data (FR-SYS)

**FR-SYS-01 — Sinkronisasi Data via Clone dari Kantor Pusat**
*Acceptance Criteria:*
- Data karyawan (dan kemungkinan data proyek, lihat FR-PROJ-01) bersumber dari proses clone terhadap database kantor pusat.
- Mekanisme dan frekuensi clone (one-time vs. berkala) mengikuti keputusan teknis pada Section 19.

---

## 12. Kebutuhan Non-Fungsional (Non-Functional Requirements)

| Kategori | Requirement | Status |
|---|---|---|
| Usability | UI/UX simple dan compact, alur tidak berbelit-belit | Confirmed |
| Arsitektur | Monorepo — Backend Laravel, Web Admin Laravel, Mobile Flutter (REST API) | Confirmed |
| Media Capture | Sistem mendukung akses kamera (foto) dan GPS di perangkat mobile & web | Confirmed |
| Sumber Data / Database | Data karyawan di-clone dari database kantor pusat, bukan koneksi real-time langsung | Confirmed — mekanisme & frekuensi lihat Section 19 |
| Format Export | CSV dan Excel | Confirmed |
| Keamanan Autentikasi | Login berbasis email + password, tanpa self-registration; wajib ganti password di login pertama | Confirmed |
| Kontrol Akses | Karyawan tidak dapat mengakses fitur absensi sebelum ganti password (FR-AUTH-02) | Confirmed |
| Keamanan API | Metode autentikasi API (mis. Laravel Sanctum/JWT) | Lihat Section 19 (Open Technical Decision) |
| Penyimpanan Foto/Media | Strategi penyimpanan (lokal, object storage, dsb.) & kompresi | Lihat Section 19 |
| Privasi Data | Penyimpanan foto & data lokasi karyawan sesuai regulasi privasi data yang berlaku | Perlu Konfirmasi lebih lanjut (regulasi acuan belum ditentukan) |
| Database Engine | Mis. MySQL/PostgreSQL | Lihat Section 19 |
| Hosting/Infrastruktur | On-premise vs cloud | Lihat Section 19 |
| Performa | Target beban pengguna bersamaan (concurrent users) | Belum ditentukan — mengikuti estimasi jumlah Karyawan PTT/Proyek aktual |
| Ketersediaan (Uptime) | Target uptime sistem | Belum ditentukan |

---

## 13. Alur Pengguna (User Flow — Format Teks)

### 13.1 Admin — Alur Pembuatan Akun Karyawan

1. Admin login ke dashboard.
2. Admin membuka menu Manajemen Karyawan → Tambah Karyawan.
3. Admin mengisi Nama, Email, ID Karyawan, dan (opsional) proyek awal.
4. Sistem membuat akun dengan password sementara dan menandainya "wajib ganti password".
5. Admin membagikan kredensial awal ke karyawan (di luar sistem — mis. secara manual/email internal).

### 13.2 Karyawan — Alur Login Pertama & Wajib Ganti Password

1. Karyawan login menggunakan email + password sementara dari Admin.
2. Sistem mendeteksi status "wajib ganti password" dan mengarahkan ke layar Ganti Password — tidak dapat dilewati.
3. Karyawan memasukkan password baru.
4. Sistem memvalidasi dan menyimpan password baru.
5. Karyawan diarahkan ke Dashboard/Home dan dapat mengakses seluruh fitur.

### 13.3 Karyawan — Alur Check In

1. Karyawan login (password sudah diganti).
2. Karyawan menuju layar Check In.
3. Karyawan memilih status kerja: WFO atau WFA.
4. Karyawan mengambil foto via kamera.
5. Sistem menangkap GPS.
6. Karyawan submit — sistem otomatis menandai proyek aktif karyawan pada record ini.
7. Jika waktu check-in setelah 08:00, sistem menandai record sebagai "Terlambat" (flag Admin saja, tidak memengaruhi karyawan).
8. Karyawan menerima konfirmasi Check In berhasil.

### 13.4 Karyawan — Alur Check Out

1. Karyawan menuju layar Check Out.
2. Karyawan mengambil foto via kamera; sistem menangkap GPS.
3. Kolom Catatan Kerjaan Harian muncul dan wajib diisi.
4. Karyawan submit.
5. Karyawan menerima konfirmasi Check Out berhasil.

### 13.5 Karyawan — Alur Input Absen Lembur

1. Karyawan membuka menu Lembur.
2. Karyawan mengisi Tanggal, Jam Mulai, Jam Selesai, Durasi, dan Keterangan.
3. Karyawan submit — tidak ada validasi foto/GPS.
4. Sistem menyimpan entri, otomatis menandai proyek aktif karyawan.

### 13.6 Admin — Alur Penugasan Proyek

1. Admin membuka menu Manajemen Karyawan → pilih karyawan.
2. Admin membuka tab Penugasan Proyek.
3. Admin memilih proyek dari data master proyek dan menandainya sebagai aktif untuk karyawan tersebut.
4. Jika diperlukan, Admin dapat menambahkan proyek aktif kedua (kasus penugasan ganda) atau memindahkan karyawan ke proyek baru (penugasan lama otomatis tercatat sebagai riwayat).

### 13.7 Admin — Alur Dashboard & Monitoring

1. Admin login ke dashboard.
2. Sistem menampilkan tujuh KPI card (Total Karyawan, Hadir Hari Ini, WFO/WFA Hari Ini, Belum Check In/Out, Lembur Hari Ini).
3. Admin dapat memfilter tampilan berdasarkan Tanggal, Karyawan, atau Proyek.
4. Admin melihat tabel kehadiran dengan kolom Karyawan, Proyek, Jam Masuk, Jam Keluar, Status, WFO/WFA, Lembur.
5. Jika ada karyawan yang melebihi ambang batas lembur, sistem menampilkan alert pada dashboard.

### 13.8 Admin — Alur Export Rekap

1. Admin membuka menu Rekapan Kehadiran.
2. Admin memilih bulan, dan (opsional) filter Karyawan/Proyek.
3. Sistem menampilkan rekap sesuai filter.
4. Admin memilih Export → CSV atau Excel.
5. Sistem menghasilkan file untuk diunduh.

---

## 14. Asumsi (Assumptions)

| # | Asumsi | Perlu Validasi Dari |
|---|---|---|
| 1 | Role Administrator dan HRD menggunakan satu panel yang sama pada v1.0 (belum ada pemisahan RBAC formal) | Mentor / HRD |
| 2 | Data master Proyek dapat dibuat manual oleh Admin dan/atau ikut di-clone dari database pusat — mekanisme pastinya ditentukan di tahap desain teknis | Technical Lead |
| 3 | Untuk karyawan dengan lebih dari satu proyek aktif secara bersamaan, aturan penentuan proyek mana yang di-tag pada satu entri absensi/lembur **belum ditentukan** — dibutuhkan klarifikasi bisnis sebelum desain teknis dimulai | Mentor / HRD |
| 4 | Mekanisme nonaktif (soft-disable) vs hapus permanen (hard-delete) pada FR-EMP-03 mengikuti konvensi teknis standar (disable sebagai default, delete sebagai opsi tambahan) — detail final di Section 19 | Technical Lead |
| 5 | Field Durasi pada form Lembur dapat dihitung otomatis dari Jam Mulai–Jam Selesai; validasi kasus non-standar (mis. lembur lintas hari) menyusul pada tahap desain UI | Technical Lead / Mentor |
| 6 | Ambang batas lembur bersifat dapat dikonfigurasi (configurable), bukan nilai tetap yang di-hardcode | Technical Lead |
| 7 | Database relational (mis. MySQL/PostgreSQL), sejalan dengan stack Laravel | Technical Lead |
| 8 | Sistem menggunakan autentikasi berbasis token untuk REST API (mis. Laravel Sanctum) | Technical Lead |
| 9 | Fitur edit profil mandiri oleh karyawan belum termasuk scope v1.0 (hanya tampilan read-only) kecuali dinyatakan lain | Mentor |

---

## 15. Risiko (Risks)

| # | Risiko | Dampak | Kemungkinan | Mitigasi |
|---|---|---|---|---|
| 1 | Ambiguitas penentuan proyek saat karyawan memiliki lebih dari satu proyek aktif dapat menyebabkan data absensi salah tag proyek | Tinggi | Sedang | Klarifikasi aturan bisnis (lihat Asumsi #3) sebelum desain teknis; pertimbangkan UI sederhana bagi karyawan untuk mengonfirmasi konteks jika multi-proyek aktif |
| 2 | Alur wajib ganti password di login pertama berpotensi membingungkan karyawan yang kurang familiar dengan aplikasi, menyebabkan lockout/kebingungan awal | Sedang | Sedang | Sediakan instruksi jelas di layar ganti password; pastikan pesan error informatif |
| 3 | Data lembur diinput manual tanpa validasi timestamp/GPS → berpotensi tidak akurat, namun risiko ini diterima karena tujuannya murni pendataan (bukan payroll) | Rendah–Sedang | Sedang | Cukup dimitigasi lewat sifat data yang non-payroll; tidak perlu kontrol tambahan pada v1.0 |
| 4 | Proses clone database dari pusat bisa menyebabkan data tidak real-time atau selisih data (karyawan, proyek) | Tinggi | Sedang | Tentukan frekuensi sinkronisasi pada Section 19; tampilkan indikator "data terakhir diperbarui pada..." di UI |
| 5 | Ketergantungan pada tim pusat untuk proses clone database dapat menjadi bottleneck teknis di luar kendali tim proyek | Tinggi | Sedang | Klarifikasi PIC dan SLA proses clone dari sisi pusat |
| 6 | Arsitektur monorepo membutuhkan koordinasi rilis antara tim backend, web, dan mobile agar tidak saling menghambat | Sedang | Sedang | Tetapkan struktur folder & pipeline CI/CD monorepo sejak awal (lihat Section 19) |
| 7 | Waktu terbatas (2 bulan) untuk scope yang kini lebih luas (manajemen karyawan, proyek, lembur, dashboard, export) berisiko terhadap kualitas testing | Tinggi | Sedang | Prioritaskan modul inti (Auth, Absensi, Dashboard) lebih dulu; modul pendukung (Export, Lembur) dapat menyusul jika perlu |

---

## 16. Metrik Keberhasilan (Success Metrics)

| Metrik | Deskripsi |
|---|---|
| Stabilitas Sistem | Berkurangnya keluhan error dibanding aplikasi pusat sebelumnya |
| Kelengkapan Data Absensi | Persentase check-in/out yang berhasil menyertakan foto + GPS |
| Kepatuhan Pelaporan Lembur | Persentase entri lembur yang terisi lengkap (tanggal, jam, durasi, keterangan) |
| Akurasi Clone Database | Selisih data antara sumber pusat dan hasil clone |
| Tingkat Adopsi Sistem | Persentase Karyawan PTT/Proyek yang aktif menggunakan sistem |
| Ketepatan Waktu Delivery | Proyek selesai dalam timeline 2 bulan |

---

## 17. Timeline Tingkat Tinggi (2 Bulan)

| Fase | Durasi (Perkiraan) | Aktivitas Utama |
|---|---|---|
| 1. Setup & System Design | Minggu 1–2 | Setup struktur monorepo, ERD (karyawan, proyek, absensi, lembur), desain API, rancangan proses clone database, wireframe UI/UX |
| 2. Development – Backend & API | Minggu 2–4 | Modul autentikasi (termasuk wajib ganti password), manajemen karyawan & proyek, absensi (foto+GPS+WFO/WFA), lembur, alert HRD |
| 3. Development – Web Admin & Mobile Frontend | Minggu 3–6 | Dashboard KPI & filter, tabel kehadiran, form lembur, alur check-in/out karyawan (web & mobile) |
| 4. Export & Integrasi Data | Minggu 5–6 | Export CSV/Excel, integrasi hasil clone database |
| 5. Integrasi & Testing | Minggu 6–7 | Testing end-to-end, validasi hasil clone database, UAT |
| 6. Deployment & Handover | Minggu 7–8 | Deployment, dokumentasi, laporan PKL |

---

## 18. Pengembangan Masa Depan (Future Enhancements)

Item berikut dikonfirmasi **di luar scope v1.0** (lihat Section 8) dan menjadi kandidat pengembangan berikutnya:

- Alur perizinan/cuti (Leave Request & Permission Workflow)
- Kalender hari libur (Holiday Calendar)
- QR Code attendance
- Face Recognition untuk verifikasi kehadiran
- Advanced Analytics
- Push Notification (menggantikan alert dashboard-only)

Item tambahan yang belum dibahas pada sesi fiksasi final dan dipertimbangkan untuk iterasi berikutnya:

- Audit Log lengkap
- Shift Schedule
- Pemisahan role formal antara Administrator dan HRD (RBAC)
- Edit profil mandiri oleh karyawan
- Alur approval untuk lembur (jika kebijakan berubah di masa depan)
- Sinkronisasi database real-time ke pusat (menggantikan clone berkala)
- Export PDF sebagai tambahan format

---

## 19. Open Technical Decisions

Item berikut adalah **keputusan teknis yang secara sengaja belum difinalisasi** pada PRD ini, dan perlu diselesaikan oleh tim engineering/Technical Lead pada tahap System Design:

| # | Topik | Pertanyaan yang Perlu Dijawab |
|---|---|---|
| 1 | Penyimpanan Gambar (Image Storage) | Foto disimpan di mana — object storage (mis. S3-compatible), disk lokal server, atau lainnya? Kebijakan kompresi/ukuran maksimum? |
| 2 | Deployment & Infrastruktur | Hosting on-premise atau cloud? Spesifikasi server? Strategi environment (staging/production)? |
| 3 | Sinkronisasi Database (Clone dari Pusat) | Mekanisme clone: one-time migration atau sinkronisasi berkala? Jika berkala, seberapa sering? Data apa saja yang di-clone (karyawan saja, atau termasuk proyek/histori)? |
| 4 | Database Engine | MySQL, PostgreSQL, atau lainnya? |
| 5 | Autentikasi API | Laravel Sanctum, JWT, Passport, atau metode lain? |
| 6 | Aturan Kompleksitas Password | Panjang minimum, kombinasi karakter, dan kebijakan expiry (jika ada) |
| 7 | Ambang Batas Lembur (Nilai Default) | Berapa jam dan periode akumulasi (harian/mingguan/bulanan) sebagai nilai default sistem yang dapat dikonfigurasi (FR-OVT-03) |
| 8 | Mekanisme Nonaktif vs Hapus Karyawan | Soft-delete (nonaktif, data tetap ada) atau hard-delete (data terhapus permanen)? |
| 9 | Penanganan Multi-Proyek Aktif | Logika auto-tagging proyek pada absensi/lembur saat karyawan memiliki lebih dari satu proyek aktif sekaligus (lihat Asumsi #3, Risiko #1) |
| 10 | Sumber Data Master Proyek | Dibuat manual oleh Admin di sistem ini, atau ikut di-clone dari database pusat? |
| 11 | Struktur & Tooling Monorepo | Struktur folder (backend, web admin, referensi mobile), pipeline CI/CD untuk mengoordinasikan rilis Laravel + Flutter dalam satu repo |
| 12 | Kolom Detail Export | Daftar kolom final pada file CSV/Excel (di luar baseline tabel kehadiran pada FR-ADM-03) |

---

## 20. Lampiran (Appendix)

### 20.1 Ringkasan Teknologi

| Layer | Teknologi | Catatan |
|---|---|---|
| Arsitektur | Monorepo | Backend, Web Admin, dan referensi API mobile dikelola dalam satu repository |
| Backend / API | Laravel | Menyediakan REST API yang dikonsumsi aplikasi mobile |
| Aplikasi Web Admin | Laravel | Route web dipisahkan dari route API |
| Aplikasi Mobile | Flutter | Mengonsumsi REST API backend |
| Database | *Engine: Open Technical Decision (Section 19)* | Sumber data: **clone dari database kantor pusat** (Confirmed) |
| Hosting/Infrastruktur | *Open Technical Decision (Section 19)* | On-premise vs. cloud belum ditentukan |

### 20.2 Ringkasan Perubahan Kunci v0.3 → v1.0

| Area | v0.3 | v1.0 (Final) |
|---|---|---|
| Target Pengguna | Seluruh karyawan (belum dibatasi) | **Confirmed — khusus Karyawan PTT/Proyek**, karyawan tetap di luar scope |
| Registrasi Akun | Belum dibahas | **Confirmed — akun dibuat/diimpor Admin, tanpa self-register** |
| Login Pertama | Belum dibahas | **Confirmed — wajib ganti password sebelum akses fitur lain** |
| Manajemen Karyawan | Belum dibahas | **Confirmed — CRUD karyawan + reset password oleh Admin** |
| Proyek | Belum ada konsep ini | **Confirmed — entitas terpisah dari Flag; dikelola Admin; auto-tag ke absensi/lembur** |
| Flag | Ada indikator keterlambatan | **Diperjelas — flag sederhana (bukan sistem status berat), mencakup status check-in/out & WFO/WFA** |
| Lembur | Durasi + keterangan | **Diperluas — tambah Jam Mulai & Jam Selesai; tegas tanpa approval** |
| Dashboard | Rekapan umum | **Confirmed — 7 KPI card spesifik + filter Tanggal/Karyawan/Proyek + tabel kehadiran terstruktur** |
| Export | CSV/Excel, rekap bulanan per karyawan | **Diperjelas — filter tambahan per Proyek** |
| Arsitektur | Belum dibahas | **Confirmed — Monorepo** |
| Out of Scope | Cuti, approval lembur | **Diperluas — tambah Holiday Calendar, QR Attendance, Face Recognition, Advanced Analytics, Push Notification** |

### 20.3 Glosarium

| Istilah | Definisi |
|---|---|
| PTT | Karyawan Proyek/Kontrak (Pekerja Tidak Tetap) — target pengguna utama sistem ini |
| PRD | Product Requirements Document |
| PKL | Praktik Kerja Lapangan |
| REST API | Representational State Transfer Application Programming Interface |
| UAT | User Acceptance Testing |
| WFO | Work From Office |
| WFA | Work From Anywhere |
| Flag | Indikator visual sederhana di sisi Admin untuk status kehadiran harian (bukan sistem status database yang kompleks) — berbeda dari konsep **Project** |
| Project (Proyek) | Entitas penugasan kerja aktual tempat karyawan ditempatkan, dikelola oleh Admin, dan diikat otomatis ke data absensi/lembur karyawan |
| Monorepo | Arsitektur satu repository yang menampung seluruh komponen backend, web admin, dan referensi API mobile |
| Clone Database | Proses menyalin data dari database kantor pusat ke database internal proyek ini, bukan koneksi real-time langsung |

---

**Akhir dari PRD v1.0 (Final)**
*Dokumen ini merupakan hasil revisi final dari seluruh proses requirement gathering (v0.1–v0.3) dan telah mengakomodasi seluruh keputusan yang dikonfirmasi. Item yang tersisa terbuka murni bersifat teknis (lihat Section 19) dan tidak menghambat dimulainya tahap System Design.*
