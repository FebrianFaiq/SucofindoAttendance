import 'dart:async';
import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../utils/id_date_helper.dart';
import '../theme/app_colors.dart';
import 'check_in_page.dart';
import 'check_out_page.dart';
import 'history_page.dart';
import 'overtime_page.dart';
import 'profile_page.dart';
import '../widgets/custom_app_bar.dart';
import '../widgets/custom_bottom_nav_bar.dart';
import '../services/attendance_service.dart';

class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});

  @override
  State<DashboardPage> createState() => DashboardPageState();
}

class DashboardPageState extends State<DashboardPage> {
  bool _hasCheckedIn = false;
  bool _hasCheckedOut = false;
  String? _clockInTime;
  String? _clockOutTime;
  String _totalDuration = '0j 0m';
  List<dynamic> _recentAttendances = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    loadDashboardData();
  }

  Future<void> loadDashboardData() async {
    setState(() => _isLoading = true);
    final result = await AttendanceService.getDashboard();
    if (result['success'] == true) {
      final data = result['data'];
      setState(() {
        _hasCheckedIn = data['has_checked_in'];
        _hasCheckedOut = data['has_checked_out'];
        _clockInTime = data['clock_in_time'];
        _clockOutTime = data['clock_out_time'];
        _totalDuration = data['total_duration'];
        _recentAttendances = data['recent_attendances'] ?? [];
      });
    }
    if (mounted) {
      setState(() => _isLoading = false);
    }
  }

  @override
  void dispose() {
    super.dispose();
  }

  String _getTodayFormatted() {
    return IdDateHelper.formatFull(DateTime.now());
  }

  void handleAction() async {
    if (!_hasCheckedIn) {
      final result = await Navigator.of(
        context,
      ).push<bool>(MaterialPageRoute(builder: (_) => const CheckInPage()));
      if (result == true) {
        loadDashboardData();
      }
    } else if (!_hasCheckedOut) {
      final result = await Navigator.of(context).push<bool>(
        MaterialPageRoute(
          builder: (_) => CheckOutPage(clockInTime: _clockInTime ?? '--:--'),
        ),
      );
      if (result == true) {
        loadDashboardData();
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header Text
          Text(
            'Absensi',
            style: GoogleFonts.mulish(
              fontSize: 24,
              fontWeight: FontWeight.w800,
              color: AppColors.primaryDark,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'Catatan kehadiran Anda hari ini',
            style: GoogleFonts.mulish(
              fontSize: 14,
              color: AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: 24),

          // Main Status Card
          _buildMainStatusCard(),
          const SizedBox(height: 16),

          // 3 Stats Cards
          _buildStatsCards(),
          const SizedBox(height: 24),

          // Riwayat Absensi
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Riwayat Absensi',
                style: GoogleFonts.mulish(
                  fontSize: 16,
                  fontWeight: FontWeight.w800,
                  color: AppColors.textPrimary,
                ),
              ),
              GestureDetector(
                onTap: () => Navigator.of(context).push(
                  MaterialPageRoute(builder: (_) => const HistoryPage()),
                ),
                child: Text(
                  'Lihat Semua',
                  style: GoogleFonts.mulish(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: AppColors.primary,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          ..._recentAttendances.map((record) => _buildHistoryCard(record)),
          const SizedBox(height: 40),
        ],
      ),
    );
  }



  Widget _buildMainStatusCard() {
    String statusText = 'Belum Absen';
    if (_hasCheckedIn && !_hasCheckedOut) statusText = 'Sedang Bekerja';
    if (_hasCheckedOut) statusText = 'Selesai Bekerja';

    String btnText = 'Clock In Sekarang';
    if (_hasCheckedIn && !_hasCheckedOut) btnText = 'Clock Out Sekarang';
    if (_hasCheckedOut) btnText = 'Sudah Selesai';

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 32, horizontal: 24),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.primary.withOpacity(0.2)),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withOpacity(0.04),
            blurRadius: 16,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        children: [
          // Dashed Circle with Clock Icon
          SizedBox(
            width: 80,
            height: 80,
            child: CustomPaint(
              painter: DashedCirclePainter(
                color: AppColors.primary.withOpacity(0.3),
                strokeWidth: 2,
                gap: 6,
              ),
              child: const Center(
                child: Icon(
                  Icons.access_time_filled,
                  color: AppColors.primaryDark,
                  size: 40,
                ),
              ),
            ),
          ),
          const SizedBox(height: 24),

          // Status & Date
          Text(
            statusText,
            style: GoogleFonts.mulish(
              fontSize: 22,
              fontWeight: FontWeight.w800,
              color: AppColors.textPrimary,
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

          // Action Button
          SizedBox(
            width: double.infinity,
            height: 48,
            child: ElevatedButton.icon(
              onPressed: _hasCheckedOut ? null : handleAction,
              icon: const Icon(
                Icons.fingerprint,
                size: 20,
                color: Colors.white,
              ),
              label: Text(btnText),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primaryDark,
                disabledBackgroundColor: AppColors.border,
                foregroundColor: Colors.white,
                disabledForegroundColor: AppColors.textMuted,
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                textStyle: GoogleFonts.mulish(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatsCards() {
    return Row(
      children: [
        Expanded(
          child: _StatCard(
            title: 'CLOCK IN',
            icon: Icons.login_outlined,
            value: _clockInTime ?? '--:--',
          ),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: _StatCard(
            title: 'CLOCK OUT',
            icon: Icons.logout_outlined,
            value: _clockOutTime ?? '--:--',
          ),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: _StatCardDuration(
            title: 'DURASI',
            icon: Icons.access_time,
            valueStr: _totalDuration,
          ),
        ),
      ],
    );
  }

  Widget _buildHistoryCard(dynamic record) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border.withOpacity(0.6)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                record['date'] ?? '-',
                style: GoogleFonts.mulish(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                '${record['clock_in'] ?? '--:--'} - ${record['clock_out'] ?? '--:--'}',
                style: GoogleFonts.mulish(
                  fontSize: 13,
                  color: AppColors.textSecondary,
                ),
              ),
            ],
          ),
          Text(
            record['duration'] ?? '0j 0m',
            style: GoogleFonts.mulish(
              fontSize: 14,
              color: AppColors.textSecondary,
            ),
          ),
        ],
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String title;
  final IconData icon;
  final String value;

  const _StatCard({
    required this.title,
    required this.icon,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border.withOpacity(0.6)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 14, color: AppColors.textSecondary),
              const SizedBox(width: 4),
              Expanded(
                child: Text(
                  title,
                  style: GoogleFonts.mulish(
                    fontSize: 10,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textSecondary,
                    letterSpacing: 0.5,
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            value,
            style: GoogleFonts.mulish(
              fontSize: 18,
              fontWeight: FontWeight.w800,
              color: AppColors.textPrimary,
            ),
          ),
        ],
      ),
    );
  }
}

class _StatCardDuration extends StatelessWidget {
  final String title;
  final IconData icon;
  final String valueStr;

  const _StatCardDuration({
    required this.title,
    required this.icon,
    required this.valueStr,
  });

  @override
  Widget build(BuildContext context) {
    // valueStr is like '0j 0m'
    final parts = valueStr.split(' ');
    String j = '0';
    String m = '0';
    if (parts.length == 2) {
      j = parts[0].replaceAll('j', '');
      m = parts[1].replaceAll('m', '');
    }

    return Container(
      padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border.withOpacity(0.6)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 14, color: AppColors.textSecondary),
              const SizedBox(width: 4),
              Expanded(
                child: Text(
                  title,
                  style: GoogleFonts.mulish(
                    fontSize: 10,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textSecondary,
                    letterSpacing: 0.5,
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            crossAxisAlignment: CrossAxisAlignment.baseline,
            textBaseline: TextBaseline.alphabetic,
            children: [
              Text(
                j,
                style: GoogleFonts.mulish(
                  fontSize: 18,
                  fontWeight: FontWeight.w800,
                  color: AppColors.textPrimary,
                ),
              ),
              Text(
                'j ',
                style: GoogleFonts.mulish(
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textSecondary,
                ),
              ),
              Text(
                m,
                style: GoogleFonts.mulish(
                  fontSize: 18,
                  fontWeight: FontWeight.w800,
                  color: AppColors.textPrimary,
                ),
              ),
              Text(
                'm',
                style: GoogleFonts.mulish(
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textSecondary,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class DashedCirclePainter extends CustomPainter {
  final Color color;
  final double strokeWidth;
  final double gap;

  DashedCirclePainter({
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

    final radius = size.width / 2;
    final center = Offset(radius, radius);
    final circumference = 2 * math.pi * radius;
    final dashCount = (circumference / (gap * 2)).floor();
    final dashAngle = (2 * math.pi) / (dashCount * 2);

    for (var i = 0; i < dashCount * 2; i++) {
      if (i % 2 == 0) {
        canvas.drawArc(
          Rect.fromCircle(center: center, radius: radius),
          i * dashAngle,
          dashAngle,
          false,
          paint,
        );
      }
    }
  }

  @override
  bool shouldRepaint(covariant DashedCirclePainter oldDelegate) {
    return oldDelegate.color != color ||
        oldDelegate.strokeWidth != strokeWidth ||
        oldDelegate.gap != gap;
  }
}
