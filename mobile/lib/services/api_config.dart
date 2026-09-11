import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'dart:io' show Platform;

class ApiConfig {
  /// All values are read from .env with sensible defaults.
  /// See .env.example for available variables.

  static String get _protocol =>
      dotenv.get('API_PROTOCOL', fallback: 'http');

  static String get _hostWeb =>
      dotenv.get('API_HOST_WEB', fallback: 'localhost');

  static String get _hostAndroidEmulator =>
      dotenv.get('API_HOST_ANDROID_EMULATOR', fallback: '10.0.2.2');

  static String get _hostLan =>
      dotenv.get('API_HOST_LAN', fallback: '127.0.0.1');

  static String get _port =>
      dotenv.get('API_PORT', fallback: '8000');

  static String get _path =>
      dotenv.get('API_PATH', fallback: '/api/v1');

  static bool get _useEmulator =>
      dotenv.get('USE_EMULATOR', fallback: 'true').toLowerCase() == 'true';

  /// Automatically picks the right base URL:
  /// - Chrome (web)             → uses API_HOST_WEB
  /// - Android emulator         → uses API_HOST_ANDROID_EMULATOR
  /// - Real device / iOS        → uses API_HOST_LAN
  static String get baseUrl {
    if (kIsWeb) {
      return '$_protocol://$_hostWeb:$_port$_path';
    }
    if (Platform.isAndroid && _useEmulator) {
      // Android emulator uses 10.0.2.2 to reach host's localhost
      return '$_protocol://$_hostAndroidEmulator:$_port$_path';
    }
    // Real device (HP fisik) / iOS — use LAN IP
    return '$_protocol://$_hostLan:$_port$_path';
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

  /// Office location configs
  static double get officeLat =>
      double.tryParse(dotenv.get('OFFICE_LAT', fallback: '-7.254776')) ?? -7.254776;

  static double get officeLng =>
      double.tryParse(dotenv.get('OFFICE_LNG', fallback: '112.717212')) ?? 112.717212;

  static double get radiusLimit =>
      double.tryParse(dotenv.get('RADIUS_LIMIT', fallback: '200')) ?? 200.0;
}

