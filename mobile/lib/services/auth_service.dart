import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'api_config.dart';

class AuthService {
  static const String keyToken = 'auth_token';
  static const String keyUser = 'auth_user';

  static Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/auth/login'),
        headers: ApiConfig.defaultHeaders,
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200 && data['status'] == 'success') {
        final token = data['data']['token'];
        final user = data['data']['user'];

        final prefs = await SharedPreferences.getInstance();
        await prefs.setString(keyToken, token);
        await prefs.setString(keyUser, jsonEncode(user));

        return {'success': true, 'must_change_password': user['must_change_password'] == true};
      } else {
        return {'success': false, 'message': data['message'] ?? 'Gagal login'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Terjadi kesalahan jaringan: $e'};
    }
  }

  static Future<bool> logout() async {
    try {
      final token = await getToken();
      if (token != null) {
        await http.post(
          Uri.parse('${ApiConfig.baseUrl}/auth/logout'),
          headers: ApiConfig.authHeaders(token),
        );
      }
    } catch (e) {
      // Ignored
    } finally {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(keyToken);
      await prefs.remove(keyUser);
    }
    return true;
  }

  static Future<Map<String, dynamic>> changePassword(String newPassword, String confirmPassword) async {
    try {
      final token = await getToken();
      if (token == null) return {'success': false, 'message': 'Tidak ada sesi aktif'};

      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/auth/change-password'),
        headers: ApiConfig.authHeaders(token),
        body: jsonEncode({
          'password': newPassword,
          'password_confirmation': confirmPassword,
        }),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200 && data['status'] == 'success') {
        // Update must_change_password in local storage
        final user = await getUser();
        if (user != null) {
          user['must_change_password'] = false;
          final prefs = await SharedPreferences.getInstance();
          await prefs.setString(keyUser, jsonEncode(user));
        }
        return {'success': true};
      } else {
        // if validation error (422)
        if (response.statusCode == 422) {
          final errors = data['errors'] as Map<String, dynamic>;
          final firstError = errors.values.first[0];
          return {'success': false, 'message': firstError};
        }
        return {'success': false, 'message': data['message'] ?? 'Gagal mengubah password'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Terjadi kesalahan jaringan: $e'};
    }
  }

  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(keyToken);
  }

  static Future<Map<String, dynamic>?> getUser() async {
    final prefs = await SharedPreferences.getInstance();
    final userStr = prefs.getString(keyUser);
    if (userStr != null) {
      return jsonDecode(userStr);
    }
    return null;
  }
}
