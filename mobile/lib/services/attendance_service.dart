import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:camera/camera.dart';
import 'auth_service.dart';
import 'api_config.dart';

class AttendanceService {
  static Future<Map<String, dynamic>> getDashboard() async {
    try {
      final token = await AuthService.getToken();
      if (token == null) return {'success': false, 'message': 'Unauthorized'};

      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/dashboard'),
        headers: ApiConfig.authHeaders(token),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200) {
        return {'success': true, 'data': data['data']};
      }
      return {'success': false, 'message': data['message'] ?? 'Error fetching dashboard'};
    } catch (e) {
      return {'success': false, 'message': 'Terjadi kesalahan jaringan: $e'};
    }
  }

  static Future<Map<String, dynamic>> checkIn(String type, double lat, double lng, XFile photo) async {
    try {
      final token = await AuthService.getToken();
      if (token == null) return {'success': false, 'message': 'Unauthorized'};

      final uri = Uri.parse('${ApiConfig.baseUrl}/attendance/check-in');
      final request = http.MultipartRequest('POST', uri)
        ..headers.addAll({
          'Authorization': 'Bearer $token',
          'Accept': 'application/json',
        })
        ..fields['type'] = type
        ..fields['gps_lat'] = lat.toString()
        ..fields['gps_lng'] = lng.toString();

      final fileBytes = await photo.readAsBytes();
      final multipartFile = http.MultipartFile.fromBytes(
        'photo',
        fileBytes,
        filename: photo.name.isNotEmpty ? photo.name : 'checkin_photo.jpg',
      );
      request.files.add(multipartFile);

      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);
      final data = jsonDecode(response.body);

      if (response.statusCode == 201 && data['status'] == 'success') {
        return {'success': true, 'data': data['data']};
      } else {
        return {'success': false, 'message': data['message'] ?? 'Gagal Check-In'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Terjadi kesalahan jaringan: $e'};
    }
  }

  static Future<Map<String, dynamic>> checkOut(
    String workNotes,
    double lat,
    double lng,
    XFile photo,
  ) async {
    try {
      final token = await AuthService.getToken();
      if (token == null) return {'success': false, 'message': 'Unauthorized'};

      final uri = Uri.parse('${ApiConfig.baseUrl}/attendance/check-out');
      final request = http.MultipartRequest('POST', uri)
        ..headers.addAll({
          'Authorization': 'Bearer $token',
          'Accept': 'application/json',
        })
        ..fields['work_notes'] = workNotes
        ..fields['gps_lat'] = lat.toString()
        ..fields['gps_lng'] = lng.toString();

      final fileBytes = await photo.readAsBytes();
      final multipartFile = http.MultipartFile.fromBytes(
        'photo',
        fileBytes,
        filename: photo.name.isNotEmpty ? photo.name : 'checkout_photo.jpg',
      );
      request.files.add(multipartFile);

      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);
      final data = jsonDecode(response.body);

      if (response.statusCode == 200 && data['status'] == 'success') {
        return {'success': true, 'data': data['data']};
      }
      return {'success': false, 'message': data['message'] ?? 'Gagal Check-Out'};
    } catch (e) {
      return {'success': false, 'message': 'Terjadi kesalahan jaringan: $e'};
    }
  }

  static Future<Map<String, dynamic>> getHistory({int page = 1}) async {
    try {
      final token = await AuthService.getToken();
      if (token == null) return {'success': false, 'message': 'Unauthorized'};

      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/attendance/history?page=$page'),
        headers: ApiConfig.authHeaders(token),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200) {
        return {'success': true, 'data': data['data'], 'meta': data['meta']};
      }
      return {'success': false, 'message': data['message'] ?? 'Gagal mengambil history'};
    } catch (e) {
      return {'success': false, 'message': 'Terjadi kesalahan jaringan: $e'};
    }
  }
}
