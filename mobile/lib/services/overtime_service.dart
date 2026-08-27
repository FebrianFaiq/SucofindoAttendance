import 'dart:convert';
import 'package:http/http.dart' as http;
import 'auth_service.dart';
import 'api_config.dart';

class OvertimeService {
  static Future<Map<String, dynamic>> getOvertimes({int page = 1}) async {
    try {
      final token = await AuthService.getToken();
      if (token == null) return {'success': false, 'message': 'Unauthorized'};

      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/overtime?page=$page'),
        headers: ApiConfig.authHeaders(token),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200) {
        return {'success': true, 'data': data['data'], 'meta': data['meta']};
      }
      return {'success': false, 'message': data['message'] ?? 'Gagal mengambil data lembur'};
    } catch (e) {
      return {'success': false, 'message': 'Terjadi kesalahan jaringan: $e'};
    }
  }

  static Future<Map<String, dynamic>> submitOvertime(String date, String start, String end, String description) async {
    try {
      final token = await AuthService.getToken();
      if (token == null) return {'success': false, 'message': 'Unauthorized'};

      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/overtime'),
        headers: ApiConfig.authHeaders(token),
        body: jsonEncode({
          'date': date,
          'start_time': start,
          'end_time': end,
          'description': description,
        }),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 201 && data['status'] == 'success') {
        return {'success': true, 'data': data['data']};
      } else {
        if (response.statusCode == 422) {
          final errors = data['errors'] as Map<String, dynamic>;
          final firstError = errors.values.first[0];
          return {'success': false, 'message': firstError};
        }
        return {'success': false, 'message': data['message'] ?? 'Gagal mengajukan lembur'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Terjadi kesalahan jaringan: $e'};
    }
  }
}
