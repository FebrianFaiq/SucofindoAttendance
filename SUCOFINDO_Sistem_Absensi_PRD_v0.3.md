# Dokumen Kebutuhan Produk (PRD)
## SUCOFINDO Attendance Management System

**Status Dokumen:** DRAFT — Versi Lengkap (Konsolidasi v0.1 – v0.3), Menunggu Fiksasi Final Hari Jumat
**Versi:** 0.3 (Full / Self-Contained)

> Dokumen ini adalah **gabungan lengkap** dari seluruh riwayat requirement (v0.1 → v0.2 → v0.3) dalam satu dokumen.

---

## 1. Informasi Dokumen

| Field | Detail |
|---|---|
| Judul Dokumen | SUCOFINDO Attendance Management System – Product Requirements Document |
| Tipe Dokumen | Draft PRD (Konsolidasi, Siap untuk Fiksasi) |
| Versi | 0.3 (Full) |
| Status | Draft — seluruh requirement dari sesi sebelumnya + tambahan HRD sudah tergabung. **Fiksasi resmi & sign-off masih menunggu rapat hari Jumat.** |
| Disusun Oleh | ~ |
| Direview Oleh | ~ |
| Disetujui Oleh (Sign-off) | ~ |
| Tanggal Dibuat | 29 Juli 2026 |
| Terakhir Diperbarui | 30 Juli 2026 |
| Kerahasiaan | ~ |

> **Catatan:** ~

---

## 2. Riwayat Versi

| Versi | Tanggal | Penulis | Deskripsi Perubahan |
|---|---|---|---|
| 0.1 | 29 Juli 2026 | *[Nama Intern PKL]* | Draft awal berdasarkan requirement gathering awal. Sebagian besar item "Perlu Konfirmasi". |
| 0.2 | 29 Juli 2026 | *[Nama Intern PKL]* | Update pasca sesi konfirmasi: login via email, WFO/WFA, foto+GPS wajib, tanpa alur cuti, catatan kerjaan saat clockout, jam kerja fleksibel dengan flag admin. |
| 0.3 | 30 Juli 2026 | *[Nama Intern PKL]* | Tambahan requirement dari HRD: absen lembur (input manual), database via clone dari pusat, format export CSV/Excel, rekap bulanan per karyawan. |
| **0.3 (Full)** | 30 Juli 2026 | *[Nama Intern PKL]* | **Versi konsolidasi** — seluruh isi v0.1–v0.3 digabung dalam satu dokumen self-contained, kode FR dirapikan per modul, siap dibawa ke rapat fiksasi Jumat. |

---

## 3. Gambaran Umum Proyek

Kami sedang mengembangkan **Attendance Management System** internal untuk mendigitalisasi dan memusatkan proses pencatatan kehadiran karyawan. Sistem ini terdiri dari:

- **Aplikasi mobile** (Flutter) — untuk karyawan
- **Aplikasi web** (Laravel) — untuk karyawan
- **Dashboard web administrator/HRD** (Laravel) — untuk admin dan HRD

Backend menggunakan Laravel dan menyediakan REST API untuk aplikasi mobile. Route aplikasi web dipisahkan dari route API.

> **Konteks bisnis:** Sebelumnya terdapat aplikasi absensi dari kantor pusat, namun sering mengalami error, sehingga SUCOFINDO memutuskan membangun sistem sendiri secara internal. Database sistem baru ini juga bersumber dari database pusat, namun karena koneksi langsung tidak memungkinkan, data akan **di-clone** ke database internal proyek ini.

Proyek masih berada pada **tahap requirement gathering**. Sebagian keputusan sudah dikonfirmasi secara awal (ditandai "Confirmed"), namun **fiksasi resmi seluruh requirement dijadwalkan hari Jumat**. Sampai saat itu, item yang ditandai "Confirmed (Awal)" masih berpotensi berubah, sedangkan yang ditandai "Perlu Konfirmasi" benar-benar belum diputuskan dan tidak boleh diasumsikan.

| Item | Detail |
|---|---|
| Nama Proyek | SUCOFINDO Attendance Management System |
| Tipe Proyek | Aplikasi Enterprise Internal (pengganti aplikasi pusat, dengan data hasil clone dari pusat) |
| Durasi | 2 Bulan |
| Model Delivery | Perlu Konfirmasi |

---

## 4. Latar Belakang Bisnis

Ada dua pendorong bisnis utama di balik proyek ini:

1. **Menggantikan aplikasi pusat yang bermasalah.** Aplikasi absensi dari kantor pusat sering mengalami error, sehingga tidak dapat diandalkan untuk pencatatan kehadiran harian.
2. **Kebutuhan HRD memonitor jam lembur karyawan.** HRD membutuhkan visibilitas terhadap siapa yang lembur, berapa lama, dan kapan durasi lembur seorang karyawan melebihi batas wajar — murni untuk keperluan **pendataan/monitoring**, bukan alur persetujuan (tidak ada alur approval lembur yang disebutkan).

Sifat pekerjaan di lingkungan ini juga **fleksibel** — tidak ada batasan waktu masuk/keluar kerja yang ketat. Sistem baru diharapkan tetap mencatat kehadiran secara akurat (lokasi + foto), namun tanpa memaksakan jam kerja kaku, dan cukup memberikan indikator/status/warning di sisi admin untuk pola kehadiran tertentu.


---

## 5. Pernyataan Masalah (Problem Statement)

> **Problem Statement (Konsolidasi):**
> SUCOFINDO sebelumnya bergantung pada aplikasi absensi terpusat yang tidak stabil (sering error), sementara sifat pekerjaan yang fleksibel (tanpa jam kerja kaku) tidak terakomodasi dengan baik oleh sistem lama. Di sisi lain, HRD juga tidak memiliki cara terpusat untuk memantau jam lembur karyawan — siapa yang lembur, berapa lama, dan kapan durasi tersebut melebihi batas wajar.
>
> Oleh karena itu dibutuhkan sistem absensi internal yang sederhana dan andal, yang mampu:
> - Memvalidasi kehadiran secara akurat melalui foto dan GPS,
> - Mengakomodasi jam kerja fleksibel tanpa membatasi karyawan,
> - Mencatat lembur secara manual untuk keperluan pendataan HRD,
> - Memberi visibilitas ke admin/HRD melalui indikator status dan alert, serta
> - Tetap berjalan meski database pusat tidak dapat diakses langsung (melalui mekanisme clone data).

---

## 6. Tujuan & Sasaran (Goals & Objectives)

| # | Tujuan | Tipe |
|---|---|---|
| 1 | Menyediakan cara yang andal bagi karyawan untuk clock-in dan clock-out via mobile dan web | Confirmed |
| 2 | Menyediakan visibilitas bagi administrator/HRD terhadap seluruh data kehadiran karyawan | Confirmed |
| 3 | Menyediakan riwayat kehadiran terpusat bagi karyawan | Confirmed |
| 4 | Menggantikan aplikasi pusat yang sering error dengan sistem internal yang lebih stabil | Confirmed (Awal) |
| 5 | Memvalidasi keakuratan kehadiran melalui foto dan lokasi GPS | Confirmed (Awal) |
| 6 | Mengakomodasi sifat kerja fleksibel tanpa membatasi jam masuk/keluar secara kaku | Confirmed (Awal) |
| 7 | Memberikan admin/HRD kemampuan rekap dan indikator status kehadiran (mis. keterlambatan) | Confirmed (Awal) |
| 8 | Menjaga UI/UX tetap simple dan compact, tidak meribetkan pengguna | Confirmed (Awal) — prinsip desain |
| 9 | Menyediakan mekanisme pencatatan lembur manual (durasi + keterangan) untuk keperluan pendataan HRD | Confirmed (Awal) |
| 10 | Memberi alert otomatis ke HRD ketika karyawan melebihi batas waktu lembur tertentu | Confirmed (Awal) — nilai batas belum ditentukan |
| 11 | Memastikan data absensi tetap tersedia meski database pusat tidak bisa diakses langsung, melalui mekanisme clone data | Confirmed (Awal) |

---

## 7. Ruang Lingkup Proyek

### 7.1 Dalam Ruang Lingkup — Confirmed (Awal, fiksasi Jumat)

| # | Fitur | Detail |
|---|---|---|
| 1 | Login via Email | Autentikasi menggunakan email (bukan username), berlaku untuk Karyawan dan Admin/HRD |
| 2 | Absensi via Web & Mobile | Karyawan dapat melakukan clock In/clock Out dari kedua kanal |
| 3 | Pilihan Lokasi Kerja | Karyawan memilih status **WFO** atau **WFA** saat absen |
| 4 | Verifikasi Foto | Wajib mengambil foto (selfie) saat clock-in maupun clock-out |
| 5 | Validasi GPS | Wajib mengambil titik lokasi (GPS) saat clock-in maupun clock-out |
| 6 | Catatan Kerjaan Harian | Kolom isian bebas untuk merangkum pekerjaan hari itu — **hanya bisa diisi saat clock Out** |
| 7 | Jam Kerja Fleksibel | Tidak ada batasan waktu wajib untuk clock-in/clock-out |
| 8 | Indikator/Flag di Admin | Sistem memberi tanda status/warning (contoh ilustratif: nama ditampilkan merah jika clock-in di atas jam 08:00) — **bersifat informatif, bukan pemblokiran** |
| 9 | Rekapan Kehadiran (Admin) | Admin/HRD dapat melihat rekap kehadiran seluruh karyawan |
| 10 | Rekap Bulanan per Karyawan | Rekap kehadiran dilihat **per bulan**, dengan detail per karyawan yang bisa dibuka |
| 11 | Absen Lembur (Overtime Entry) | Karyawan input **manual**: durasi lembur (jam) dan keterangan pekerjaan lembur — **tidak berbasis timestamp** |
| 12 | Alert Batas Lembur | Sistem memberi notifikasi ke HRD saat karyawan melebihi batas waktu lembur tertentu — nilai batas Perlu Konfirmasi |
| 13 | Export Rekap | Format **CSV / Excel** |
| 14 | Database via Clone | Data bersumber dari database pusat, disinkronkan melalui proses clone, bukan koneksi real-time langsung |
| 15 | Prinsip Desain | UI simple dan compact, alur tidak berbelit |

### 7.2 Dihapus dari Ruang Lingkup (Confirmed — TIDAK dikerjakan)

| Fitur | Keterangan |
|---|---|
| Alur Perizinan / Cuti (Leave Request) | **Dikonfirmasi tidak diperlukan** untuk versi ini |
| Alur Persetujuan Lembur (Approval) | Tidak disebutkan oleh HRD — **diasumsikan lembur hanya bersifat pendataan, tanpa approval**. **karena akan ada pengecekan secara eksplisit** |

### 7.3 Masih Perlu Konfirmasi (untuk Jumat)

| # | Fitur | Catatan |
|---|---|---|
| 1 | Lupa Password | Belum dibahas |
| 2 | Manajemen Data Karyawan oleh Admin | Belum dibahas |
| 3 | QR Code Attendance | Tidak disebutkan — kemungkinan tidak dipakai karena sudah pakai foto+GPS |
| 4 | Threshold Keterlambatan | Contoh "jam 8" hanya ilustrasi, angka resmi belum fix |
| 5 | Shift Schedule | Kemungkinan tidak relevan karena jam kerja fleksibel |
| 6 | Holiday Management | Belum dibahas |
| 7 | Notifikasi (channel: push/email/in-app) | Belum dibahas — termasuk untuk alert lembur HRD |
| 8 | Audit Log | Belum dibahas |
| 9 | Approval Lembur | Belum dikonfirmasi apakah benar-benar tidak diperlukan |
| 10 | Batas jam lembur yang memicu alert | Belum ada angka pasti |
| 11 | Frekuensi & mekanisme clone database dari pusat | One-time migration atau sinkronisasi berkala? |
| 12 | Kolom/format detail export CSV/Excel | Field apa saja yang perlu ada di file export |
| 13 | Database engine | Belum dibahas |
| 14 | Hosting/infrastruktur | On-premise vs cloud belum ditentukan |

---

## 8. Di Luar Ruang Lingkup (Out of Scope)

| Item | Status |
|---|---|
| Alur Perizinan / Pengajuan Cuti | **Confirmed — Out of Scope** |
| Alur Approval Lembur | Diasumsikan out of scope — **Perlu Konfirmasi** |
| Perhitungan kompensasi/insentif lembur | Perlu Konfirmasi apakah bagian sistem ini atau sistem lain (payroll) |
| Pemrosesan payroll | Perlu Konfirmasi |
| Integrasi hardware biometrik (fingerprint/face scanner) | Perlu Konfirmasi |
| Integrasi HRIS pihak ketiga | Perlu Konfirmasi |
| Dukungan multi-company / multi-tenant | Perlu Konfirmasi |

---

## 9. Stakeholder

| Peran | Nama | Tanggung Jawab | Status |
|---|---|---|---|
| Project Sponsor | *[TBD]* | Pemilik bisnis, persetujuan akhir | Perlu Konfirmasi |
| Product Owner / Mentor | *[TBD]* | Validasi requirement, prioritisasi | Perlu Konfirmasi |
| Tim IT / Development | *[Intern PKL]* | Merancang, membangun, dan menguji sistem | Confirmed (diri sendiri) |
| Departemen HRD | *[TBD]* | **Confirmed sebagai sumber requirement lembur & rekap** — nama kontak Perlu Konfirmasi | Sebagian Confirmed |
| End User – Karyawan | Karyawan SUCOFINDO | Menggunakan sistem untuk absensi harian & lembur | Confirmed |
| End User – Administrator/HRD | *[TBD departemen]* | Mengelola dan memantau data kehadiran & lembur | Perlu Konfirmasi |
| QA / Tester | *[TBD]* | Pengujian dan validasi | Perlu Konfirmasi |

> **Perlu Konfirmasi:** Apakah HRD menggunakan role Administrator yang sama, atau perlu role terpisah (mis. "HRD" vs "Admin Umum") dengan akses berbeda? Ada matriks RBAC yang dibutuhkan?

---

## 10. Peran Pengguna (User Roles)

### 10.1 Karyawan (Employee)

| Atribut | Detail |
|---|---|
| Login | Menggunakan **email** — Confirmed |
| Kanal Akses | Web, Mobile |
| Aksi Absensi Harian | clock In, clock Out — pilih **WFO/WFA**, ambil **foto**, ambil **GPS** |
| Catatan Kerjaan | Isi kolom rangkuman pekerjaan — **hanya aktif saat clock Out** |
| Batasan Waktu | **Tidak ada** — kerja fleksibel |
| Input Absen Lembur | Mengisi form lembur: durasi (jam), keterangan pekerjaan — **manual, bukan timestamp** |
| Riwayat | Melihat riwayat kehadiran & lembur miliknya sendiri |
| Profil | Melihat informasi profil |
| Fitur Menunggu Konfirmasi | Lupa Password, edit profil mandiri |

### 10.2 Administrator / HRD

| Atribut | Detail |
|---|---|
| Kanal Akses | Web Dashboard |
| Login | Menggunakan **email** — Confirmed |
| Dashboard | Ringkasan kehadiran & lembur harian |
| Lihat Seluruh Data Kehadiran | Termasuk indikator status/warning keterlambatan |
| Monitoring Lembur | Melihat data lembur seluruh karyawan: siapa, berapa lama, keterangan |
| Alert Lembur Berlebih | Menerima alert/notifikasi ketika karyawan melebihi batas lembur tertentu |
| Rekapan Kehadiran | Melihat rekap **bulanan**, dengan drill-down ke detail per karyawan |
| Export | Mengunduh rekap dalam format **CSV atau Excel** |
| Fitur Menunggu Konfirmasi | Manajemen Data Karyawan, Audit Log, filter/search lanjutan |

---

## 11. Kebutuhan Fungsional (Functional Requirements)

> Kode FR pada versi ini dirapikan menggunakan penamaan modular: **FR-AUTH** (autentikasi), **FR-ATT** (absensi harian), **FR-OVT** (lembur/overtime), **FR-ADM** (admin/HRD & rekap), **FR-SYS** (sistem/infrastruktur).

### 11.1 Confirmed (Awal — fiksasi Jumat)

| Kode | Fitur | Deskripsi | Peran |
|---|---|---|---|
| FR-AUTH-01 | Autentikasi via Email | User login menggunakan email + password, berlaku di web & mobile | Karyawan, Admin/HRD |
| FR-ATT-01 | Pilihan Lokasi Kerja | Karyawan memilih WFO atau WFA saat absen | Karyawan |
| FR-ATT-02 | clock In dengan Foto + GPS | Sistem mewajibkan capture foto dan titik lokasi saat clock-in | Karyawan |
| FR-ATT-03 | clock Out dengan Foto + GPS | Sistem mewajibkan capture foto dan titik lokasi saat clock-out | Karyawan |
| FR-ATT-04 | Catatan Kerjaan Harian | Field isian bebas untuk rangkuman kerja, hanya editable saat proses clock Out | Karyawan |
| FR-ATT-05 | Riwayat Kehadiran | Karyawan dapat melihat riwayat kehadirannya (termasuk status WFO/WFA & catatan kerjaan) | Karyawan |
| FR-ATT-06 | Profil Karyawan | Karyawan dapat melihat profil | Karyawan |
| FR-OVT-01 | Input Absen Lembur | Karyawan mengisi form manual: durasi lembur (jam), keterangan pekerjaan lembur, untuk tanggal tertentu | Karyawan |
| FR-OVT-02 | Daftar Lembur (HRD) | HRD dapat melihat daftar seluruh entri lembur karyawan | Administrator/HRD |
| FR-OVT-03 | Alert Batas Lembur | Sistem mengirim notifikasi/alert ke HRD saat total jam lembur karyawan melebihi batas tertentu | Administrator/HRD |
| FR-ADM-01 | Dashboard Admin/HRD | Ringkasan kehadiran & lembur untuk admin | Administrator/HRD |
| FR-ADM-02 | Lihat Seluruh Data Kehadiran | Admin dapat melihat data kehadiran seluruh karyawan | Administrator/HRD |
| FR-ADM-03 | Indikator Status/Warning | Sistem menandai kondisi tertentu secara visual (mis. nama merah bila clock-in melewati jam tertentu) — informasi, bukan pemblokiran | Administrator/HRD |
| FR-ADM-04 | Rekapan Kehadiran Bulanan | Admin/HRD dapat melihat rekap kehadiran per bulan | Administrator/HRD |
| FR-ADM-05 | Rekap Detail per Karyawan | Admin/HRD dapat membuka detail rekap satu karyawan untuk satu bulan tertentu | Administrator/HRD |
| FR-ADM-06 | Export Rekap CSV/Excel | Admin/HRD dapat export rekap kehadiran dalam format CSV atau Excel | Administrator/HRD |
| FR-SYS-01 | Sinkronisasi Data via Clone | Data karyawan bersumber dari clone database pusat | Sistem |

### 11.2 Perlu Konfirmasi (untuk Jumat) — Belum Ditentukan: Dikembangkan atau Dibuang dari Scope

| Kode | Fitur | Catatan | Rekomendasi Keputusan yang Perlu Diambil Jumat |
|---|---|---|---|
| FR-AUTH-02 | Lupa Password | Mekanisme reset password belum ditentukan | Dikembangkan / Dibuang |
| FR-ADM-07 | Manajemen Data Karyawan | CRUD karyawan oleh admin belum ditentukan | Dikembangkan / Dibuang |
| FR-ATT-07 | QR Code Attendance | Kemungkinan tidak dipakai karena sudah ada foto+GPS | Dikembangkan / Dibuang |
| FR-ATT-08 | Threshold Keterlambatan Resmi | Contoh "jam 8" baru ilustrasi | Wajib diputuskan (bukan opsional) |
| FR-ATT-09 | Shift Schedule | Kemungkinan tidak relevan karena kerja fleksibel | Dikembangkan / Dibuang |
| FR-ADM-08 | Holiday Management | Pengelolaan kalender libur | Dikembangkan / Dibuang |
| FR-ADM-09 | Notifikasi Sistem | Channel: push/email/in-app, termasuk untuk alert lembur | Wajib diputuskan (minimal untuk alert lembur) |
| FR-ADM-10 | Audit Log | Cakupan aksi yang perlu dicatat | Dikembangkan / Dibuang |
| FR-OVT-04 | Approval Lembur | Apakah entri lembur perlu di-approve HRD atau otomatis tercatat | Wajib diputuskan |
| FR-OVT-05 | Angka Batas Lembur (Threshold Alert) | Berapa jam/hari atau jam/bulan yang memicu alert | Wajib diputuskan |
| FR-ADM-11 | Kolom Export CSV/Excel | Field spesifik: nama, tanggal, jam masuk/keluar, WFO/WFA, lembur, dll | Wajib diputuskan |
| FR-SYS-02 | Mekanisme Clone Database | One-time saat setup, atau sinkronisasi berkala (harian/mingguan)? Data apa saja yang di-clone? | Wajib diputuskan |

---

## 12. Kebutuhan Non-Fungsional (Non-Functional Requirements)

> Nilai/angka spesifik pada beberapa baris di bawah ini adalah **contoh usulan standar industri**, bukan keputusan resmi dari mentor/HRD. Tetap ditandai "Perlu Konfirmasi" sampai disahkan di rapat Jumat — supaya tidak keliru dianggap requirement final.

| Kategori | Requirement | Status |
|---|---|---|
| Usability | UI/UX harus simple dan compact, alur tidak berbelit-belit | Confirmed (Awal) |
| Reliabilitas | Sistem harus lebih stabil dibanding aplikasi pusat sebelumnya | Confirmed (Awal) — metrik pasti Perlu Konfirmasi |
| Media Capture | Sistem harus mendukung akses kamera (foto) dan GPS di perangkat mobile & web | Confirmed (Awal) |
| Sumber Data / Database | Data di-clone dari database pusat, bukan koneksi real-time langsung | Confirmed (Awal) — mekanisme & frekuensi Perlu Konfirmasi |
| Format Export | CSV / Excel | Confirmed (Awal) |
| Ukuran File Foto | *Usulan: maks. 200KB per foto agar upload cepat di jaringan lemah* | **Perlu Konfirmasi** (usulan, belum disahkan) |
| Kompresi/Resolusi Foto | *Usulan: resolusi dikompres otomatis di sisi klien sebelum upload* | **Perlu Konfirmasi** |
| Keamanan / Autentikasi API | *Usulan: menggunakan Laravel Sanctum (token-based)* | **Perlu Konfirmasi** (usulan teknis, belum disahkan mentor) |
| Privasi Data | Penyimpanan foto & data lokasi karyawan harus sesuai regulasi privasi data yang berlaku | Perlu Konfirmasi (regulasi acuan, mis. UU PDP) |
| Konsistensi Data Clone | Strategi penanganan jika terjadi selisih data antara sumber pusat dan hasil clone | Perlu Konfirmasi |
| Database Engine | Mis. MySQL/PostgreSQL | Perlu Konfirmasi |
| Hosting/Infrastruktur | On-premise vs cloud | Perlu Konfirmasi |
| Performa | Target beban pengguna bersamaan (concurrent users) | Perlu Konfirmasi |
| Ketersediaan (Uptime) | Target uptime sistem | Perlu Konfirmasi |
| Dukungan Platform | Versi Android/iOS minimum yang didukung | Perlu Konfirmasi |
| Dukungan Browser | Browser yang didukung untuk aplikasi web | Perlu Konfirmasi |
| Backup & Recovery | Frekuensi backup dan rencana disaster recovery | Perlu Konfirmasi |

---

## 13. Alur Pengguna (User Flow — Format Teks)

> Diagram lengkap (Mermaid flowchart) untuk seluruh alur di bawah ini tersedia terpisah di dokumen **User Flow Documentation**. Bagian ini merangkum alur dalam format teks agar PRD tetap bisa dibaca berdiri sendiri.

### 13.1 Karyawan — Alur clock In

1. Karyawan login menggunakan email dan password.
2. Karyawan menuju layar clock In.
3. Karyawan memilih status kerja: WFO atau WFA.
4. Sistem meminta izin kamera → karyawan mengambil foto.
5. Sistem menangkap titik lokasi GPS.
6. Karyawan submit clock In.
7. Sistem mencatat timestamp, status WFO/WFA, foto, dan lokasi — **tanpa validasi waktu wajib**.
8. Jika clock-in melewati jam tertentu (contoh: jam 8), sistem menandai record untuk flag di sisi admin — bukan penolakan.
9. Karyawan menerima konfirmasi clock In berhasil.

### 13.2 Karyawan — Alur clock Out

1. Karyawan menuju layar clock Out.
2. Sistem meminta izin kamera → karyawan mengambil foto.
3. Sistem menangkap titik lokasi GPS.
4. Kolom **Catatan Kerjaan Harian** muncul dan wajib diisi.
5. Karyawan submit clock Out.
6. Sistem mencatat timestamp, foto, lokasi, dan catatan kerjaan.
7. Karyawan menerima konfirmasi clock Out berhasil.

### 13.3 Karyawan — Alur Input Absen Lembur

1. Karyawan membuka menu Lembur (terpisah dari clock In/clock Out biasa).
2. Karyawan memilih tanggal lembur.
3. Karyawan mengisi durasi lembur (jam) secara manual.
4. Karyawan mengisi keterangan pekerjaan lembur.
5. Karyawan submit — **tidak ada validasi timestamp/GPS/foto** untuk entri ini.
6. *(Perlu Konfirmasi: apakah entri lembur tampil di halaman Riwayat yang sama dengan absensi biasa, atau terpisah?)*

### 13.4 Karyawan — Alur Melihat Riwayat Kehadiran

1. Karyawan login.
2. Karyawan membuka menu Riwayat Kehadiran.
3. Sistem menampilkan daftar kehadiran: tanggal, jam clock-in/out, status WFO/WFA, foto, lokasi, catatan kerjaan.

### 13.5 Administrator/HRD — Alur Rekapan & Monitoring Kehadiran

1. Admin/HRD login ke web dashboard.
2. Sistem menampilkan ringkasan dashboard.
3. Admin membuka menu Rekapan Kehadiran.
4. Sistem menampilkan data seluruh karyawan: waktu clock-in/out, status WFO/WFA, foto, lokasi, catatan kerjaan.
5. Sistem menampilkan indikator visual (mis. nama merah) untuk kondisi tertentu seperti keterlambatan.

### 13.6 Administrator/HRD — Alur Monitoring & Alert Lembur

1. HRD login ke dashboard.
2. HRD membuka menu Data Lembur.
3. Sistem menampilkan daftar entri lembur seluruh karyawan (nama, tanggal, durasi, keterangan).
4. Sistem menghitung akumulasi jam lembur per karyawan (*periode Perlu Konfirmasi: harian/mingguan/bulanan*).
5. Jika akumulasi melebihi batas (*nilai Perlu Konfirmasi*), sistem menampilkan alert ke HRD.
6. HRD dapat membuka detail karyawan terkait.

### 13.7 Administrator/HRD — Alur Export Rekap

1. Admin/HRD membuka menu Rekapan Kehadiran.
2. Admin/HRD memilih bulan yang ingin dilihat.
3. Sistem menampilkan rekap seluruh karyawan untuk bulan tersebut.
4. Admin/HRD klik satu karyawan untuk melihat detail rekap bulanan karyawan tersebut.
5. Admin/HRD memilih Export → pilih format CSV atau Excel.
6. Sistem menghasilkan file untuk diunduh.

---

## 14. Asumsi (Assumptions)

| # | Asumsi | Perlu Validasi Dari |
|---|---|---|
| 1 | Setiap karyawan memiliki satu akun unik yang digunakan di web maupun mobile | Product Owner / HR |
| 2 | Peran Administrator/HRD terpisah dari Karyawan dan tidak melakukan aksi absensi harian | Product Owner |
| 3 | Sistem menggunakan autentikasi berbasis token untuk REST API (mis. Laravel Sanctum) | Technical Lead / Mentor |
| 4 | Database relational (mis. MySQL/PostgreSQL), sejalan dengan stack Laravel | Technical Lead |
| 5 | "Jam tertentu" pada contoh indikator (mis. jam 8) hanya ilustrasi, bukan aturan resmi | Mentor / HR |
| 6 | Indikator status di admin bersifat pasif (menandai saja), tidak memblokir absensi karyawan | Mentor |
| 7 | WFO/WFA dipilih manual oleh karyawan saat absen, bukan dideteksi otomatis dari lokasi | Mentor |
| 8 | Foto dan GPS wajib diisi untuk setiap clock-in dan clock-out (tidak opsional) | Mentor |
| 9 | Entri lembur tidak memerlukan approval — tercatat otomatis begitu karyawan submit | HRD |
| 10 | Entri lembur terpisah dari absensi biasa (menu berbeda), tidak menggunakan foto/GPS | HRD / Mentor |
| 11 | Clone database dilakukan secara berkala (bukan one-time saja), agar data tetap relevan | Technical Lead |
| 12 | Alert batas lembur dikirim ke HRD saja, bukan ke karyawan yang bersangkutan | HRD |
| 13 | Rekap "per bulan" berarti satu tampilan mencakup tanggal 1 s.d. akhir bulan kalender | HRD |

---

## 15. Pertanyaan Terbuka / Perlu Konfirmasi (untuk Fiksasi Jumat)

| # | Pertanyaan | Kategori |
|---|---|---|
| 1 | Berapa batas jam lembur yang memicu alert ke HRD? (per hari? per minggu? per bulan?) | Business Rule |
| 2 | Apakah entri lembur perlu approval dari HRD, atau otomatis tercatat? | Fungsional |
| 3 | Apakah data lembur akan dipakai untuk perhitungan kompensasi/insentif, atau murni pendataan? | Business |
| 4 | Apakah karyawan bisa mengisi/mengedit entri lembur untuk tanggal yang sudah lewat, atau hanya hari ini? | Fungsional |
| 5 | Field apa saja yang wajib ada di file export CSV/Excel? | Fungsional |
| 6 | Apakah rekap bulanan bisa difilter (per departemen, per WFO/WFA), atau hanya per karyawan/bulan? | Fungsional |
| 7 | Clone database: one-time migration di awal, atau sinkronisasi berkala? Kalau berkala, seberapa sering? | Teknis |
| 8 | Data apa saja yang di-clone dari pusat — hanya master data karyawan, atau termasuk histori absensi lama? | Teknis |
| 9 | Siapa yang bertanggung jawab menjaga proses clone database (tim pusat atau tim internal)? | Teknis / Governance |
| 10 | Apakah HRD adalah role yang sama dengan "Administrator", atau perlu role terpisah dengan akses berbeda? | Governance |
| 11 | Angka pasti threshold keterlambatan (contoh jam 8)? | Business Rule |
| 12 | Apakah warning keterlambatan hanya visual (warna nama) atau perlu label teks juga (mis. "Terlambat")? | Fungsional |
| 13 | Apakah WFO/WFA memengaruhi validasi GPS (mis. radius kantor untuk WFO)? | Fungsional |
| 14 | Apakah QR Code benar-benar tidak dipakai? | Fungsional |
| 15 | Apakah fitur Lupa Password dibutuhkan? | Fungsional |
| 16 | Apakah admin bisa kelola data karyawan (tambah/edit/nonaktif)? | Fungsional |
| 17 | Database engine apa yang dipakai? | Teknis |
| 18 | Hosting on-premise atau cloud? | Teknis |
| 19 | Apakah dibutuhkan notifikasi (push/email), minimal untuk alert lembur? | Fungsional |
| 20 | Apakah dibutuhkan audit log? | Fungsional / Compliance |
| 21 | Siapa saja stakeholder resmi (sponsor, mentor, kontak HRD)? | Governance |
| 22 | Kebijakan privasi untuk penyimpanan foto & data lokasi karyawan? | Compliance |
| 23 | Berapa target jumlah pengguna (karyawan/admin)? | Non-Fungsional |
| 24 | Apakah dibutuhkan batas ukuran/kompresi foto untuk efisiensi upload? | Non-Fungsional |

---

## 16. Risiko (Risks)

| # | Risiko | Dampak | Kemungkinan | Mitigasi (Draft) |
|---|---|---|---|---|
| 1 | Requirement yang belum jelas/lengkap dapat menyebabkan rework dalam timeline 2 bulan yang singkat | Tinggi | Sedang | Prioritaskan konfirmasi seluruh pertanyaan terbuka sebelum development dimulai |
| 2 | Threshold warning keterlambatan (mis. jam 8) belum resmi — bisa berubah saat fiksasi dan memengaruhi desain flag | Sedang | Tinggi | Buat threshold sebagai nilai konfigurasi, bukan hardcode |
| 3 | Data lembur diinput manual tanpa validasi timestamp → berpotensi tidak akurat/dimanipulasi | Sedang | Sedang | Diskusikan kebutuhan validasi tambahan (mis. approval HRD) saat fiksasi |
| 4 | Proses clone database dari pusat bisa menyebabkan data tidak real-time atau selisih data | Tinggi | Sedang | Pastikan frekuensi sinkronisasi jelas; beri indikator "data terakhir diperbarui pada..." di UI |
| 5 | Ketergantungan pada tim pusat untuk proses clone database bisa menjadi bottleneck teknis di luar kendali tim proyek | Tinggi | Sedang | Klarifikasi PIC dan SLA proses clone dari sisi pusat |
| 6 | Scope creep dari fitur "Perlu Konfirmasi" yang ditambahkan di tengah development | Tinggi | Sedang | Bekukan scope setelah PRD v1.0 disetujui; kelola penambahan via change request |
| 7 | Waktu terbatas (2 bulan) sebagai proyek intern mungkin tidak memungkinkan testing/hardening penuh | Sedang | Tinggi | Definisikan scope MVP secara jelas; tunda fitur non-kritikal ke Future Enhancements |
| 8 | Isu privasi data jika foto/GPS disimpan tanpa panduan kebijakan yang jelas | Tinggi | Rendah–Sedang | Konfirmasi kebutuhan compliance sebelum implementasi penuh |

---

## 17. Metrik Keberhasilan (Success Metrics)

| Kandidat Metrik | Deskripsi | Status |
|---|---|---|
| Stabilitas Sistem | Berkurangnya keluhan error dibanding aplikasi pusat sebelumnya | Confirmed (Awal) sebagai tujuan kualitatif |
| Kelengkapan Data Absensi | % clock-in/out yang berhasil menyertakan foto + GPS | Perlu Konfirmasi (target %) |
| Kepatuhan Pelaporan Lembur | % entri lembur yang terisi lengkap (durasi + keterangan) | Perlu Konfirmasi |
| Akurasi Clone Database | Selisih data antara sumber pusat dan hasil clone | Perlu Konfirmasi |
| Tingkat Adopsi Sistem | % karyawan aktif menggunakan sistem baru | Perlu Konfirmasi |
| Ketepatan Waktu Delivery | Proyek selesai dalam timeline 2 bulan | Confirmed sebagai constraint proyek |

---

## 18. Timeline Tingkat Tinggi (2 Bulan)

| Fase | Durasi (Perkiraan) | Aktivitas Utama |
|---|---|---|
| 1. Requirement Gathering & Fiksasi PRD | Minggu 1–2 (fiksasi Jumat ini) | Finalisasi seluruh item "Perlu Konfirmasi", PRD naik ke v1.0 |
| 2. System Design | Minggu 2–3 | ERD (termasuk tabel lembur), desain API (termasuk endpoint foto/GPS), rancangan proses clone database, wireframe UI/UX |
| 3. Development – Backend & API | Minggu 3–5 | Modul autentikasi, absensi (foto+GPS+WFO/WFA), modul lembur, alert HRD, proses clone DB |
| 4. Development – Web & Mobile Frontend | Minggu 3–6 | Alur clock-in/out, catatan kerjaan, form lembur karyawan, dashboard admin/HRD (rekap bulanan, export CSV/Excel) |
| 5. Integrasi & Testing | Minggu 6–7 | Testing end-to-end, validasi hasil clone database, UAT |
| 6. Deployment & Handover | Minggu 7–8 | Deployment, dokumentasi, laporan PKL |

*Catatan: Timeline bersifat ilustratif dan harus divalidasi terhadap constraint proyek aktual serta ekspektasi mentor.*

---

## 19. Pengembangan Masa Depan (Future Enhancements)

- Alur perizinan/cuti (jika suatu saat dibutuhkan kembali — saat ini eksplisit out of scope)
- Approval workflow untuk lembur (jika ternyata dibutuhkan)
- QR Code attendance (jika foto+GPS dirasa kurang cukup)
- Integrasi otomatis perhitungan kompensasi lembur ke sistem payroll
- Sinkronisasi database real-time ke pusat (menggantikan clone berkala)
- Sistem notifikasi otomatis (push/email), termasuk untuk alert lembur
- Audit log lengkap
- Export PDF sebagai tambahan format (selain CSV/Excel)
- Anti-spoofing untuk foto/GPS (liveness detection, mock-location detection)
- Integrasi dengan platform HRIS pihak ketiga

---

## 20. Lampiran (Appendix)

### 20.1 Ringkasan Teknologi

| Layer | Teknologi | Catatan |
|---|---|---|
| Backend / API | Laravel | Menyediakan REST API yang dikonsumsi aplikasi mobile |
| Aplikasi Web | Laravel | Route web dipisahkan dari route API |
| Aplikasi Mobile | Flutter | Mengonsumsi REST API backend |
| Database | *Perlu Konfirmasi (engine)* | **Confirmed: sumber data via clone dari database pusat** |
| Hosting/Infrastruktur | *Perlu Konfirmasi* | On-premise vs. cloud belum ditentukan |

### 20.2 Riwayat Perubahan Kunci (Ringkasan Kumulatif)

| Area | v0.1 | v0.2 | v0.3 |
|---|---|---|---|
| Login | Belum ditentukan | Via Email | — |
| Lokasi Kerja | Belum ada | WFO / WFA | — |
| Verifikasi | Perlu Konfirmasi | Foto + GPS wajib | — |
| Cuti/Izin | Perlu Konfirmasi | Dihapus — tidak diperlukan | — |
| Keterlambatan | Perlu Konfirmasi | Ada indikator/flag (bukan blocking) | — |
| Catatan Kerjaan | Belum ada | Field baru saat clock Out | — |
| Jam Kerja | Perlu Konfirmasi | Fleksibel, tanpa batas waktu wajib | — |
| Rekapan Admin | Perlu Konfirmasi | Confirmed — ada fitur rekapan | Rekap jadi bulanan + drill-down per karyawan |
| Lembur | — | Masuk daftar Perlu Konfirmasi | Confirmed — input manual, tanpa timestamp/foto/GPS |
| Alert HRD | — | — | Confirmed — alert saat lembur lewat batas |
| Database | — | Perlu Konfirmasi | Confirmed — hasil clone dari pusat |
| Format Export | — | Perlu Konfirmasi (Excel/PDF) | Confirmed — CSV/Excel |

### 20.3 Glosarium

| Istilah | Definisi |
|---|---|
| PRD | Product Requirements Document |
| PKL | Praktik Kerja Lapangan |
| MVP | Minimum Viable Product |
| REST API | Representational State Transfer Application Programming Interface |
| RBAC | Role-Based Access Control |
| UAT | User Acceptance Testing |
| WFO | Work From Office |
| WFA | Work From Anywhere |
| Flag/Warning Indicator | Penanda visual di sisi admin untuk kondisi tertentu (mis. keterlambatan), bersifat informatif dan tidak memblokir aksi user |
| Absen Lembur / Overtime Entry | Entri manual jam lembur karyawan, terpisah dari absensi clock In/Out biasa |
| Clone Database | Proses menyalin data dari database pusat ke database internal proyek ini, bukan koneksi real-time langsung |

### 20.4 Dokumen Referensi

> **Perlu Konfirmasi:** Belum ada dokumen pendukung resmi (mis. SOP absensi/lembur dari HR, kebijakan privasi data internal, brand/UI guidelines) yang diberikan. Akan dilampirkan setelah tersedia.

---

## 21. clocklist Perbaikan Menuju PRD v1.0 (Pasca Rapat Jumat)

Gunakan draft v0.3 (dokumen ini) sebagai bahan rapat fiksasi hari Jumat. Setelah seluruh poin "Perlu Konfirmasi" terjawab, lakukan update berikut agar status dokumen berubah dari **Draft v0.3** menjadi **Approved v1.0**:

| # | Section Terkait | Hal yang Harus Diperbarui Pasca Rapat Jumat |
|---|---|---|
| 1 | Section 1 & 9 | Hapus seluruh tulisan `[TBD]` atau "Perlu Konfirmasi". Isi nama resmi Mentor, Stakeholder HRD, dan Sign-off Approval. |
| 2 | Section 7 & 11 | Pindahkan seluruh baris di tabel 11.2 ("Perlu Konfirmasi") ke tabel 11.1 ("Confirmed"), masing-masing dengan status jelas: **Dikembangkan** atau **Dibuang dari Scope**. |
| 3 | Section 11 | Kode FR sudah dirapikan per modul (FR-ATT-xx, FR-OVT-xx, FR-ADM-xx, FR-AUTH-xx, FR-SYS-xx) di versi ini — pastikan kode tetap konsisten saat item dari 11.2 dipindahkan ke 11.1. |
| 4 | Section 12 | Ubah status NFR dari "Perlu Konfirmasi" menjadi angka/standar terukur yang **disahkan mentor** (mis. ukuran foto maks. berapa KB, metode auth API resmi apa, database engine resmi apa) — bukan sekadar usulan seperti pada draft ini. |
| 5 | Section 14 & 15 | Hapus tabel Asumsi dan Pertanyaan Terbuka yang sudah terjawab; sisakan hanya yang benar-benar masih relevan (jika ada) untuk iterasi berikutnya. |
| 6 | Section 2 | Tambahkan entri baru "v1.0 — Approved" pada Riwayat Versi, termasuk tanggal dan nama penyetuju. |
| 7 | Status Dokumen | Ubah label di bagian atas dokumen dari **"DRAFT"** menjadi **"APPROVED — v1.0"**. |
| 8 | Section 18 | Sesuaikan timeline jika ada perubahan scope hasil keputusan Jumat (mis. jika Notifikasi/Audit Log ternyata masuk scope, tambahkan ke fase development). |

> Setelah clocklist ini selesai dijalankan, dokumen dapat disebarkan sebagai **PRD v1.0 — Approved** dan menjadi acuan resmi untuk fase System Design (Section 18, Fase 2).

---

**Akhir dari Draft PRD v0.3 (Full)**
*Dokumen ini adalah versi konsolidasi lengkap yang menggabungkan seluruh riwayat requirement v0.1–v0.3. Item bertanda "Confirmed (Awal)" masih berpotensi disesuaikan sampai proses fiksasi resmi hari Jumat. Ikuti clocklist di Section 21 untuk menaikkan dokumen ini menjadi PRD v1.0 — Approved.*
