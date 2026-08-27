import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:image_picker/image_picker.dart';
import '../utils/id_date_helper.dart';
import '../theme/app_colors.dart';
import '../widgets/custom_app_bar.dart';
import '../services/attendance_service.dart';
import '../services/location_service.dart';

class CheckInPage extends StatefulWidget {
  const CheckInPage({super.key});

  @override
  State<CheckInPage> createState() => _CheckInPageState();
}

class _CheckInPageState extends State<CheckInPage> {
  late Timer _timer;
  String _liveTime = '';

  String _workMode = 'WFO';
  bool _photoTaken = false;
  bool _isSubmitting = false;

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

  void _updateTime() {
    if (mounted) {
      setState(() {
        _liveTime = IdDateHelper.formatTime(DateTime.now());
      });
    }
  }

  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }

  String _getTodayFormatted() {
    return IdDateHelper.formatFull(DateTime.now());
  }

  final ImagePicker _picker = ImagePicker();
  XFile? _photoFile;

  void _capturePhoto() async {
    try {
      final pickedFile = await _picker.pickImage(
        source: ImageSource.camera,
        imageQuality: 50, // compress to 50%
        maxWidth: 800,
      );

      if (pickedFile != null) {
        setState(() {
          _photoFile = pickedFile;
          _photoTaken = true;
        });
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Row(
                children: [
                  const Icon(Icons.check_circle, color: Colors.white, size: 18),
                  const SizedBox(width: 8),
                  Text(
                    'Foto berhasil diambil',
                    style: GoogleFonts.mulish(fontWeight: FontWeight.w600),
                  ),
                ],
              ),
              backgroundColor: AppColors.success,
              behavior: SnackBarBehavior.floating,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              duration: const Duration(seconds: 2),
            ),
          );
        }
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Gagal mengambil foto: $e')),
      );
    }
  }

  Future<void> _handleSubmit() async {
    if (!_photoTaken || _photoFile == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Silakan ambil foto terlebih dahulu',
            style: GoogleFonts.mulish(fontWeight: FontWeight.w600),
          ),
          backgroundColor: AppColors.danger,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
        ),
      );
      return;
    }

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

    setState(() => _isSubmitting = true);
    
    double lat = _latitude!;
    double lng = _longitude!;

    final result = await AttendanceService.checkIn(
      _workMode,
      lat,
      lng,
      _photoFile!,
    );

    if (!mounted) return;
    setState(() => _isSubmitting = false);

    if (result['success'] == true) {
      // Show success dialog
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
              decoration: BoxDecoration(
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
              'Clock In Berhasil!',
              style: GoogleFonts.mulish(
                fontSize: 18,
                fontWeight: FontWeight.w800,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Waktu masuk tercatat pukul $_liveTime.\nSelamat bekerja!',
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
          content: Text(result['message'] ?? 'Gagal melakukan Clock In'),
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
                  : const Icon(
                      Icons.fingerprint,
                      size: 20,
                      color: Colors.white,
                    ),
              label: Text(
                _isSubmitting ? 'Memproses...' : 'Konfirmasi Clock In',
                style: GoogleFonts.mulish(
                  fontWeight: FontWeight.w700,
                  fontSize: 14,
                ),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primaryDark,
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
          children: [
            // Time Section
            const SizedBox(height: 8),
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
            const SizedBox(height: 32),

            // Mode Kerja
            _buildWorkModeCard(),
            const SizedBox(height: 24),

            // Verifikasi Wajah
            _buildPhotoCard(),
            const SizedBox(height: 24),

            // Lokasi Saat Ini
            _buildLocationCard(),
          ],
        ),
      ),
    );
  }

  Widget _buildWorkModeCard() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Mode Kerja',
          style: GoogleFonts.mulish(
            fontSize: 13,
            fontWeight: FontWeight.w800,
            color: AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: 12),
        Container(
          decoration: BoxDecoration(
            color: const Color(0xFFF0F4FA),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.primary.withOpacity(0.2)),
          ),
          child: Row(
            children: [
              _modeTab('WFO', _workMode == 'WFO'),
              _modeTab('WFA', _workMode == 'WFA'),
            ],
          ),
        ),
      ],
    );
  }

  Widget _modeTab(String mode, bool isActive) {
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _workMode = mode),
        child: Container(
          margin: const EdgeInsets.all(4),
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: isActive ? AppColors.primaryDark : Colors.transparent,
            borderRadius: BorderRadius.circular(8),
          ),
          child: Text(
            mode,
            textAlign: TextAlign.center,
            style: GoogleFonts.mulish(
              fontSize: 13,
              fontWeight: FontWeight.w700,
              color: isActive ? Colors.white : AppColors.textSecondary,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildPhotoCard() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Verifikasi Wajah',
          style: GoogleFonts.mulish(
            fontSize: 13,
            fontWeight: FontWeight.w800,
            color: AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: 12),
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.border.withOpacity(0.5)),
          ),
          child: Column(
            children: [
              CustomPaint(
                painter: DashedRectPainter(
                  color: AppColors.textSecondary.withOpacity(0.5),
                  strokeWidth: 2,
                  gap: 6,
                ),
                child: Container(
                  height: 220,
                  width: double.infinity,
                  color: AppColors.primary.withOpacity(0.1),
                  child: Center(
                    child: Container(
                      width: 80,
                      height: 80,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: AppColors.primary.withOpacity(0.3),
                          width: 1.5,
                        ),
                      ),
                      child: Icon(
                        Icons.face,
                        size: 40,
                        color: AppColors.textSecondary.withOpacity(0.8),
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Text(
                'Posisikan wajah Anda di dalam bingkai untuk verifikasi biometrik otomatis.',
                textAlign: TextAlign.center,
                style: GoogleFonts.mulish(
                  fontSize: 12,
                  color: AppColors.textSecondary,
                  height: 1.5,
                ),
              ),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: _capturePhoto,
                  icon: const Icon(Icons.camera_alt_outlined, size: 18),
                  label: const Text('Ambil Foto'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFE2E8F0),
                    foregroundColor: AppColors.textSecondary,
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
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
}

class DashedRectPainter extends CustomPainter {
  final Color color;
  final double strokeWidth;
  final double gap;

  DashedRectPainter({
    required this.color,
    required this.strokeWidth,
    required this.gap,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = strokeWidth
      ..style = PaintingStyle.stroke;

    _drawDashedLine(
      canvas,
      const Offset(0, 0),
      Offset(size.width, 0),
      paint,
    ); // top
    _drawDashedLine(
      canvas,
      Offset(size.width, 0),
      Offset(size.width, size.height),
      paint,
    ); // right
    _drawDashedLine(
      canvas,
      Offset(size.width, size.height),
      Offset(0, size.height),
      paint,
    ); // bottom
    _drawDashedLine(
      canvas,
      Offset(0, size.height),
      const Offset(0, 0),
      paint,
    ); // left
  }

  void _drawDashedLine(Canvas canvas, Offset p1, Offset p2, Paint paint) {
    final distance = (p2 - p1).distance;
    final direction = (p2 - p1) / distance;
    double currentDistance = 0.0;
    while (currentDistance < distance) {
      final start = p1 + direction * currentDistance;
      currentDistance += gap;
      if (currentDistance > distance) currentDistance = distance;
      final end = p1 + direction * currentDistance;
      canvas.drawLine(start, end, paint);
      currentDistance += gap;
    }
  }

  @override
  bool shouldRepaint(covariant DashedRectPainter oldDelegate) {
    return oldDelegate.color != color ||
        oldDelegate.strokeWidth != strokeWidth ||
        oldDelegate.gap != gap;
  }
}
