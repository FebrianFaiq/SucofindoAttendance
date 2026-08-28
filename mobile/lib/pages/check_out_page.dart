import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:camera/camera.dart' show XFile;
import '../utils/id_date_helper.dart';
import '../theme/app_colors.dart';
import '../widgets/custom_app_bar.dart';
import '../widgets/inline_camera_widget.dart';
import '../services/attendance_service.dart';
import '../services/location_service.dart';

class CheckOutPage extends StatefulWidget {
  final String clockInTime;

  const CheckOutPage({super.key, required this.clockInTime});

  @override
  State<CheckOutPage> createState() => _CheckOutPageState();
}

class _CheckOutPageState extends State<CheckOutPage> {
  late Timer _timer;
  String _liveTime = '';
  String _duration = '0j 0m';

  final _notesController = TextEditingController();
  bool _isSubmitting = false;

  // Photo state
  bool _photoTaken = false;
  XFile? _photoFile;

  // Location state — fetched from GPS
  String _locationAddress = 'Mengambil lokasi...';
  bool _locationFetched = false;
  bool _locationError = false;
  double? _latitude;
  double? _longitude;

  @override
  void initState() {
    super.initState();
    _updateTime();
    _timer = Timer.periodic(const Duration(seconds: 1), (_) => _updateTime());
    _fetchLocation();
  }

  void _updateTime() {
    final now = DateTime.now();
    if (mounted) {
      setState(() {
        _liveTime = IdDateHelper.formatTime(now);
        _duration = _calculateDuration();
      });
    }
  }

  String _calculateDuration() {
    final parts = widget.clockInTime.split(':');
    if (parts.length < 2) return '0j 0m';
    final inMinutes = int.parse(parts[0]) * 60 + int.parse(parts[1]);
    final now = DateTime.now();
    final nowMinutes = now.hour * 60 + now.minute;
    final diff = nowMinutes - inMinutes;
    if (diff < 0) return '0j 0m';
    return '${diff ~/ 60}j ${diff % 60}m';
  }

  Future<void> _fetchLocation() async {
    final position = await LocationService.getCurrentPosition();
    if (position != null) {
      final address = await LocationService.getAddressFromCoordinates(
        position.latitude,
        position.longitude,
      );
      if (mounted) {
        setState(() {
          _latitude = position.latitude;
          _longitude = position.longitude;
          _locationAddress = address;
          _locationFetched = true;
          _locationError = false;
        });
      }
    } else {
      if (mounted) {
        setState(() {
          _locationAddress = 'Gagal mengambil lokasi. Tap untuk coba lagi.';
          _locationError = true;
        });
      }
    }
  }

  @override
  void dispose() {
    _timer.cancel();
    _notesController.dispose();
    super.dispose();
  }

  String _getTodayFormatted() {
    return IdDateHelper.formatFull(DateTime.now());
  }

  Future<void> _handleSubmit() async {
    // Validate photo
    if (!_photoTaken || _photoFile == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Silakan ambil foto terlebih dahulu',
            style: GoogleFonts.mulish(fontWeight: FontWeight.w600),
          ),
          backgroundColor: AppColors.danger,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        ),
      );
      return;
    }

    // Validate location
    if (!_locationFetched || _latitude == null || _longitude == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Lokasi belum tersedia. Pastikan GPS aktif.',
            style: GoogleFonts.mulish(fontWeight: FontWeight.w600),
          ),
          backgroundColor: AppColors.danger,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        ),
      );
      return;
    }

    // Validate work notes
    if (_notesController.text.trim().length < 10) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Catatan pekerjaan minimal 10 karakter',
            style: GoogleFonts.mulish(fontWeight: FontWeight.w600),
          ),
          backgroundColor: AppColors.danger,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        ),
      );
      return;
    }

    setState(() => _isSubmitting = true);

    final result = await AttendanceService.checkOut(
      _notesController.text.trim(),
      _latitude!,
      _longitude!,
      _photoFile!,
    );

    if (!mounted) return;
    setState(() => _isSubmitting = false);

    if (result['success'] == true) {
      await showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(height: 8),
            Container(
              width: 64,
              height: 64,
              decoration: const BoxDecoration(
                color: AppColors.successLight,
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.check_circle_rounded,
                color: AppColors.success,
                size: 36,
              ),
            ),
            const SizedBox(height: 18),
            Text(
              'Clock Out Berhasil!',
              style: GoogleFonts.mulish(
                fontSize: 18,
                fontWeight: FontWeight.w800,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Waktu keluar tercatat pukul $_liveTime.\nTerima kasih atas kerja keras Anda!',
              textAlign: TextAlign.center,
              style: GoogleFonts.mulish(
                fontSize: 13,
                color: AppColors.textSecondary,
                height: 1.5,
              ),
            ),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.of(ctx).pop();
                  Navigator.of(context).pop(true);
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
                child: Text(
                  'Kembali ke Dashboard',
                  style: GoogleFonts.mulish(fontWeight: FontWeight.w700),
                ),
              ),
            ),
          ],
        ),
      ),
    );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(result['message'] ?? 'Gagal melakukan Clock Out'),
          backgroundColor: AppColors.danger,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF9F9FF),
      appBar: const CustomAppBar(),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(24),
        color: const Color(0xFFF9F9FF),
        child: SafeArea(
          child: SizedBox(
            height: 52,
            child: ElevatedButton.icon(
              onPressed: _isSubmitting ? null : _handleSubmit,
              icon: _isSubmitting
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(
                        strokeWidth: 2.5,
                        valueColor: AlwaysStoppedAnimation(Colors.white),
                      ),
                    )
                  : const Icon(Icons.logout_outlined, size: 20, color: Colors.white),
              label: Text(
                _isSubmitting ? 'Memproses...' : 'Konfirmasi Clock Out',
                style: GoogleFonts.mulish(fontWeight: FontWeight.w700, fontSize: 14),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.danger,
                foregroundColor: Colors.white,
                disabledBackgroundColor: AppColors.border,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Main Time Card
            _buildMainTimeCard(),
            const SizedBox(height: 16),

            // Stats Row
            Row(
              children: [
                Expanded(child: _buildStatCard('Clock In', Icons.login_outlined, widget.clockInTime)),
                const SizedBox(width: 16),
                Expanded(child: _buildStatCard('Durasi Kerja', Icons.timer, _duration)),
              ],
            ),
            const SizedBox(height: 24),

            // Verifikasi Wajah — Inline Camera
            InlineCameraWidget(
              onPhotoCaptured: (photo) {
                setState(() {
                  _photoFile = photo;
                  _photoTaken = true;
                });
              },
              onPhotoCleared: () {
                setState(() {
                  _photoFile = null;
                  _photoTaken = false;
                });
              },
            ),
            const SizedBox(height: 24),

            // Lokasi Saat Ini
            _buildLocationCard(),
            const SizedBox(height: 24),

            // Catatan Pekerjaan
            _buildNotesField(),
          ],
        ),
      ),
    );
  }

  Widget _buildMainTimeCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 32, horizontal: 24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border, width: 1.2),
      ),
      child: Column(
        children: [
          Text(
            'WAKTU SAAT INI',
            style: GoogleFonts.mulish(
              fontSize: 11,
              fontWeight: FontWeight.w700,
              color: AppColors.textSecondary,
              letterSpacing: 1,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            _liveTime,
            style: GoogleFonts.mulish(
              fontSize: 48,
              fontWeight: FontWeight.w800,
              color: AppColors.primaryDark,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            _getTodayFormatted(),
            style: GoogleFonts.mulish(
              fontSize: 14,
              color: AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: 24),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: AppColors.dangerLight,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.logout_outlined, size: 14, color: AppColors.danger),
                const SizedBox(width: 8),
                Text(
                  'Siap Untuk Clock Out',
                  style: GoogleFonts.mulish(
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                    color: AppColors.danger,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard(String title, IconData icon, String value) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border, width: 1.2),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(11), // Slightly less than 12 to fit inside border
        child: Stack(
          clipBehavior: Clip.none,
          children: [
            Positioned(
              right: -15,
              top: -15,
              child: Container(
                width: 60,
                height: 60,
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  color: Color(0xFFF0F4FA),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(icon, size: 16, color: AppColors.textSecondary),
                      const SizedBox(width: 8),
                      Text(
                        title,
                        style: GoogleFonts.mulish(
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    value,
                    style: GoogleFonts.mulish(
                      fontSize: 20,
                      fontWeight: FontWeight.w800,
                      color: AppColors.textPrimary,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLocationCard() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Lokasi Saat Ini',
              style: GoogleFonts.mulish(
                fontSize: 13,
                fontWeight: FontWeight.w800,
                color: AppColors.textPrimary,
              ),
            ),
            if (_locationFetched)
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 4,
                ),
                decoration: BoxDecoration(
                  color: AppColors.primary.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Row(
                  children: [
                    const Icon(
                      Icons.check_circle_outline,
                      size: 12,
                      color: AppColors.primaryDark,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      'GPS Aktif',
                      style: GoogleFonts.mulish(
                        fontSize: 10,
                        fontWeight: FontWeight.w700,
                        color: AppColors.primaryDark,
                      ),
                    ),
                  ],
                ),
              ),
            if (_locationError)
              GestureDetector(
                onTap: _fetchLocation,
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: AppColors.danger.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.refresh, size: 12, color: AppColors.danger),
                      const SizedBox(width: 4),
                      Text(
                        'Coba Lagi',
                        style: GoogleFonts.mulish(
                          fontSize: 10,
                          fontWeight: FontWeight.w700,
                          color: AppColors.danger,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
          ],
        ),
        const SizedBox(height: 12),
        Container(
          width: double.infinity,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.border.withOpacity(0.5)),
          ),
          child: Column(
            children: [
              ClipRRect(
                borderRadius: const BorderRadius.vertical(
                  top: Radius.circular(12),
                ),
                child: Container(
                  height: 120,
                  width: double.infinity,
                  color: const Color(0xFFE8F0FE),
                  child: Stack(
                    children: [
                      Positioned.fill(
                        child: GridView.builder(
                          physics: const NeverScrollableScrollPhysics(),
                          gridDelegate:
                              const SliverGridDelegateWithFixedCrossAxisCount(
                                crossAxisCount: 6,
                              ),
                          itemBuilder: (ctx, i) => Icon(
                            Icons.map,
                            size: 40,
                            color: Colors.blue.withOpacity(0.05),
                          ),
                        ),
                      ),
                      Center(
                        child: _locationFetched
                            ? const Icon(
                                Icons.location_on,
                                size: 40,
                                color: AppColors.primaryDark,
                              )
                            : _locationError
                                ? const Icon(
                                    Icons.location_off,
                                    size: 40,
                                    color: AppColors.danger,
                                  )
                                : const SizedBox(
                                    width: 30,
                                    height: 30,
                                    child: CircularProgressIndicator(strokeWidth: 3),
                                  ),
                      ),
                    ],
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(
                      Icons.location_on_outlined,
                      size: 20,
                      color: _locationError ? AppColors.danger : AppColors.primaryDark,
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            _locationAddress,
                            style: GoogleFonts.mulish(
                              fontSize: 12,
                              color: _locationError ? AppColors.danger : AppColors.textPrimary,
                              height: 1.4,
                            ),
                          ),
                          if (_locationFetched && _latitude != null) ...[
                            const SizedBox(height: 4),
                            Text(
                              'Koordinat: ${_latitude!.toStringAsFixed(6)}, ${_longitude!.toStringAsFixed(6)}',
                              style: GoogleFonts.mulish(
                                fontSize: 11,
                                color: AppColors.textSecondary,
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildNotesField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            RichText(
              text: TextSpan(
                text: 'Catatan Pekerjaan ',
                style: GoogleFonts.mulish(
                  fontSize: 13,
                  fontWeight: FontWeight.w800,
                  color: AppColors.textPrimary,
                ),
                children: const [
                  TextSpan(
                    text: '*',
                    style: TextStyle(color: AppColors.danger),
                  ),
                ],
              ),
            ),
            Text(
              'Minimal 10 karakter',
              style: GoogleFonts.mulish(
                fontSize: 11,
                color: AppColors.textMuted,
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Theme(
          data: Theme.of(context).copyWith(
            inputDecorationTheme: const InputDecorationTheme(
              filled: true,
              fillColor: Colors.white,
            ),
          ),
          child: TextField(
            controller: _notesController,
            maxLines: 6,
            style: GoogleFonts.mulish(
              fontSize: 14,
              color: AppColors.textPrimary,
            ),
            decoration: InputDecoration(
              hintText: 'Ceritakan pekerjaan atau aktivitas yang Anda lakukan hari ini...',
              hintStyle: GoogleFonts.mulish(
                fontSize: 14,
                color: AppColors.textMuted,
              ),
              filled: true,
              fillColor: Colors.white,
              contentPadding: const EdgeInsets.all(16),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: const BorderSide(color: AppColors.border, width: 1.2),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: const BorderSide(color: AppColors.border, width: 1.2),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: const BorderSide(color: AppColors.primary, width: 1.5),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
