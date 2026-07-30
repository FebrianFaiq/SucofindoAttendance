# 📝 FORMULIR FIKSASI & HASIL DECISION LOG (RAPAT JUMAT)
**Proyek:** SUCOFINDO Attendance Management System  
**Tanggal Rapat:** Jumat, 31 Juli 2026  
**Peserta Rapat:** [Isi Nama Mentor, Stakeholder HRD, Intern]  

---

## 🎯 1. Keputusan Scope Fitur "Perlu Konfirmasi" (Section 11.2 PRD)

> *Instruksi: Centang salah satu status [x] berdasarkan hasil diskusi.*

* [ ] **FR-AUTH-02: Fitur Lupa Password**
  * [ ] **IN-SCOPE** (Fitur dibuat di MVP 2 bulan)
  * [ ] **OUT-OF-SCOPE** (Manual via admin jika lupa password)
  * **Catatan/Keputusan:** _______________________________________

* [ ] **FR-ADM-07: CRUD Management Data Karyawan oleh Admin**
  * [ ] **IN-SCOPE** (Admin bisa tambah/edit/hapus karyawan secara internal)
  * [ ] **OUT-OF-SCOPE** (Murni hanya terima data pasif dari Clone DB)
  * **Catatan/Keputusan:** _______________________________________

* [ ] **FR-ATT-07: QR Code Attendance**
  * [ ] **IN-SCOPE**
  * [ ] **OUT-OF-SCOPE** (Fix hanya pakai Foto + GPS)
  * **Catatan/Keputusan:** _______________________________________

* [ ] **FR-ADM-08: Holiday Management (Kalender Libur)**
  * [ ] **IN-SCOPE**
  * [ ] **OUT-OF-SCOPE** (Abaikan status tanggal merah di sistem)
  * **Catatan/Keputusan:** _______________________________________

* [ ] **FR-ADM-09: Channel Notifikasi Sistem (Alert Lembur)**
  * [ ] **Push Notification Mobile**
  * [ ] **Email Notification**
  * [ ] **In-App Dashboard Notification saja (Web HRD)**
  * **Catatan/Keputusan:** _______________________________________

* [ ] **FR-ADM-10: Audit Log**
  * [ ] **IN-SCOPE**
  * [ ] **OUT-OF-SCOPE**
  * **Catatan/Keputusan:** _______________________________________

---

## ⚙️ 2. Fiksasi Aturan Bisnis (Business Rules) & Parameter

* [ ] **Batas Lembur (Overtime Threshold Alert)**
  * Berapa jam batas lembur yang akan memicu *alert* ke HRD?
  * [ ] > ....... Jam / Hari
  * [ ] > ....... Jam / Minggu
  * [ ] > ....... Jam / Bulan
  * **Catatan:** _______________________________________

* [ ] **Threshold Keterlambatan (Flag/Warning Admin)**
  * Jam berapa *clock-in* yang dianggap terlambat untuk memicu flag warna?
  * [ ] Jam resmi masuk: **08:00 WIB**
  * [ ] Jam resmi masuk lainnya: **....... : ....... WIB**
  * **Catatan:** _______________________________________

* [ ] **Validasi Entry Lembur Manual**
  * Apakah entri lembur butuh approval HRD/Atasan?
    * [ ] Tidak butuh (Otomatis tercatat / murni pendataan)
    * [ ] Butuh Approval (In-Scope fitur approval sederhana)
  * Apakah karyawan bisa menginput lembur tanggal yang sudah lewat (backdate)?
    * [ ] Boleh, maksimal H-....... hari
    * [ ] Hanya bisa di hari H saja

---

## 💻 3. Technical & Data Decisions (Ke Mentor / Tim IT)

* [ ] **Clone Database Mechanism (FR-SYS-02)**
  * Frekuensi Sinkronisasi Data:
    * [ ] One-time migration di awal proyek saja
    * [ ] Berkala: [ ] Harian / [ ] Mingguan / [ ] Bulanan
  * Cakupan Data yang Di-clone:
    * [ ] Hanya Master Data Karyawan (NIP, Nama, Email, Dept)
    * [ ] Master Data + Histori Absensi Lama
  * Penanggung Jawab / PIC Clone DB dari Pusat: .....................

* [ ] **Format Export CSV / Excel (FR-ADM-06)**
  * Kolom wajib yang harus muncul di file export:
    * [x] Nama & NIP Karyawan
    * [x] Tanggal & Jam Clock-In / Clock-Out
    * [x] Lokasi (WFO/WFA) + Coordinate GPS
    * [x] Catatan Kerjaan Harian
    * [x] Durasi & Keterangan Lembur
    * [ ] Kolom Tambahan: .......................................

* [ ] **Infrastruktur & Stack**
  * Database Engine Resmi: [ ] MySQL / [ ] PostgreSQL / [ ] Lainnya: .......
  * Environment Hosting: [ ] Server On-Premise Sucofindo / [ ] Cloud / [ ] Local Dev saja dulu

---
