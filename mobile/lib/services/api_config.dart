import 'package:flutter/foundation.dart' show kIsWeb;
import 'dart:io' show Platform;

class ApiConfig {
  /// Automatically picks the right base URL:
  /// - Chrome (web)      → localhost:8000 (php artisan serve)
  /// - Android emulator  → 10.0.2.2:8000 (alias to host localhost)
  /// - Real device       → your LAN IP (change _lanIp below)
  static const String _lanIp = '10.197.77.254'; // ← ganti sesuai IP laptop Anda

  static String get baseUrl {
    if (kIsWeb) {
      // Flutter web (Chrome) — bisa pakai localhost langsung
      return 'http://localhost:8000/api/v1';
    }
    if (Platform.isAndroid) {
      // Android emulator uses 10.0.2.2 to reach host's localhost
      return 'http://10.0.2.2:8000/api/v1';
    }
    // iOS simulator / real device — use LAN IP
    return 'http://$_lanIp:8000/api/v1';
  }

  static Map<String, String> defaultHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  static Map<String, String> authHeaders(String token) {
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    };
  }
}
