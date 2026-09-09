# 📋 Checklist Deploy: Mobile App (Dev → Production)

> Catatan pengingat hal-hal yang perlu dikonfigurasi ulang saat deploy ke production.
> Tandai `[x]` saat sudah dikerjakan.

---

## 1. Konfigurasi `.env`

| Variable | Development (sekarang) | Production |
|----------|----------------------|------------|
| `API_PROTOCOL` | `http` | `https` |
| `API_HOST_LAN` | IP lokal (`192.168.x.x`) | Domain server (misal `api.sucofindo.com`) |
| `API_PORT` | `8000` | `443` (atau sesuai server) |
| `USE_EMULATOR` | `true` / `false` | `false` |

Contoh `.env` production:
```env
API_PROTOCOL=https
API_HOST_WEB=api.sucofindo.com
API_HOST_ANDROID_EMULATOR=10.0.2.2
API_HOST_LAN=api.sucofindo.com
API_PORT=443
API_PATH=/api/v1
USE_EMULATOR=false
```

- `[ ]` Update semua variable `.env` sesuai server production
- `[ ]` Pastikan `.env` **TIDAK** ikut ter-commit (sudah di `.gitignore`)

---

## 2. Android: Cleartext Traffic

File: `android/app/src/main/AndroidManifest.xml`

```diff
 <application
     android:label="mobile"
     android:name="${applicationName}"
     android:icon="@mipmap/ic_launcher"
-    android:usesCleartextTraffic="true">
+    android:usesCleartextTraffic="false">
```

> ⚠️ `usesCleartextTraffic="true"` mengizinkan koneksi HTTP tidak terenkripsi.
> Di production dengan HTTPS, set ke `false` atau hapus baris ini untuk keamanan.

- `[ ]` Set `android:usesCleartextTraffic="false"` atau hapus atribut ini

---

## 3. App Identity & Branding

### Application ID
File: `android/app/build.gradle.kts`

- `[ ]` Ganti `applicationId` dari default ke ID unik (misal `com.sucofindo.mobile`)
- `[ ]` Set `versionName` dan `versionCode` sesuai rilis

### App Name
File: `android/app/src/main/AndroidManifest.xml`

- `[ ]` Ganti `android:label="mobile"` → `android:label="Sucofindo"` (atau nama app final)

### App Icon
- `[ ]` Ganti icon default Flutter dengan icon Sucofindo
- `[ ]` Gunakan package seperti `flutter_launcher_icons` untuk generate semua ukuran

---

## 4. App Signing (Wajib untuk Play Store)

> ❗ APK/AAB untuk production **harus di-sign** dengan release keystore.
> Tanpa ini, Play Store akan menolak upload.

- `[ ]` Generate keystore: `keytool -genkey -v -keystore release-key.jks -keyalg RSA -keysize 2048 -validity 10000`
- `[ ]` Simpan keystore di tempat aman (**JANGAN commit ke Git!**)
- `[ ]` Konfigurasi signing di `android/app/build.gradle.kts`
- `[ ]` Tambahkan `*.jks` dan `key.properties` ke `.gitignore`

---

## 5. Build Mode

- `[ ]` Build dalam **release mode** (bukan debug):
  ```bash
  # APK
  flutter build apk --release

  # App Bundle (untuk Play Store)
  flutter build appbundle --release
  ```
- `[ ]` `debugShowCheckedModeBanner` sudah otomatis hilang di release mode

---

## 6. Remove Debug Dependencies

File: `pubspec.yaml`

- `[ ]` Pastikan tidak ada package debug-only di `dependencies` (pindahkan ke `dev_dependencies`)
- `[ ]` Jalankan `flutter pub outdated` dan update package jika perlu

---

## 7. Backend / Server

- `[ ]` Pastikan server production sudah punya **SSL certificate** (HTTPS)
- `[ ]` Pastikan API endpoint production sudah aktif dan bisa diakses
- `[ ]` Konfigurasi **CORS** di Laravel jika perlu (untuk web)
- `[ ]` Set `APP_ENV=production` dan `APP_DEBUG=false` di `.env` Laravel

---

## 8. Firewall & Jaringan

- `[ ]` **Hapus** rule firewall development yang tadi ditambahkan (port 8000):
  ```powershell
  # Jalankan sebagai Administrator
  netsh advfirewall firewall delete rule name="Laravel Dev Server"
  ```
  > Ini hanya untuk development lokal, tidak perlu di production.

---

## Quick Summary

| Komponen | Dev | Prod |
|----------|-----|------|
| Protocol | `http` | `https` |
| Host | IP lokal / `localhost` | Domain server |
| Port | `8000` | `443` |
| Cleartext Traffic | `true` | `false` |
| Build Mode | `debug` | `release` |
| App Signing | tidak perlu | **wajib** |
| `APP_DEBUG` (Laravel) | `true` | `false` |
