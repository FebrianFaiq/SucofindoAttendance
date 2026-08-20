import 'dart:async';
import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../utils/id_date_helper.dart';
import '../theme/app_colors.dart';
import 'check_in_page.dart';
import 'check_out_page.dart';
import 'history_page.dart';
import 'profile_page.dart';

class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  bool _hasCheckedIn = false;
  bool _hasCheckedOut = false;
  String? _clockInTime;
  String? _clockOutTime;
  late Timer _timer;

  @override
  void initState() {
    super.initState();
    _updateTime();
    _timer = Timer.periodic(const Duration(seconds: 1), (_) => _updateTime());
  }

  void _updateTime() {
    if (mounted) setState(() {});
  }

  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }

  String _getTodayFormatted() {
    return IdDateHelper.formatFull(DateTime.now());
  }

  String _getTotalDuration() {
    if (_clockInTime == null) return '0j 0m';
    if (_clockOutTime != null) {
      final inParts = _clockInTime!.split(':');
      final outParts = _clockOutTime!.split(':');
      final inMinutes = int.parse(inParts[0]) * 60 + int.parse(inParts[1]);
      final outMinutes = int.parse(outParts[0]) * 60 + int.parse(outParts[1]);
      final diff = outMinutes - inMinutes;
      return '${diff ~/ 60}j ${diff % 60}m';
    }
    final inParts = _clockInTime!.split(':');
    final now = DateTime.now();
    final inMinutes = int.parse(inParts[0]) * 60 + int.parse(inParts[1]);
    final nowMinutes = now.hour * 60 + now.minute;
    final diff = nowMinutes - inMinutes;
    if (diff < 0) return '0j 0m';
    return '${diff ~/ 60}j ${diff % 60}m';
  }

  void _handleAction() async {
    if (!_hasCheckedIn) {
      final result = await Navigator.of(context).push<bool>(
        MaterialPageRoute(builder: (_) => const CheckInPage()),
      );
      if (result == true && mounted) {
        setState(() {
          _hasCheckedIn = true;
          _clockInTime = IdDateHelper.formatTime(DateTime.now());
        });
      }
    } else if (!_hasCheckedOut) {
      final result = await Navigator.of(context).push<bool>(
        MaterialPageRoute(
          builder: (_) => CheckOutPage(clockInTime: _clockInTime ?? '--:--'),
        ),
      );
      if (result == true && mounted) {
        setState(() {
          _hasCheckedOut = true;
          _clockOutTime = IdDateHelper.formatTime(DateTime.now());
        });
      }
    }
  }

  // Static recent attendance data (Riwayat Absensi)
  static final List<Map<String, String>> _recentAttendances = [
    {
      'dateTitle': 'Jumat, 20 Okt',
      'time': '08:00 - 17:00',
      'duration': '9j 0m',
    },
    {
      'dateTitle': 'Kamis, 19 Okt',
      'time': '08:15 - 17:00',
      'duration': '8j 45m',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF9F9FF),
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(70),
        child: Container(
          decoration: BoxDecoration(
            color: Colors.white,
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.05),
                blurRadius: 10,
                offset: const Offset(0, 2),
              ),
            ],
            borderRadius: const BorderRadius.only(
              bottomLeft: Radius.circular(16),
              bottomRight: Radius.circular(16),
            ),
          ),
          child: SafeArea(
            child: Row(
              children: [
                IconButton(
                  icon: const Icon(Icons.arrow_back, color: AppColors.primaryDark),
                  onPressed: () => Navigator.of(context).pop(),
                ),
                Expanded(
                  child: Center(
                    child: Padding(
                      padding: const EdgeInsets.only(right: 48), // balance the back button
                      child: Image.asset(
                        'assets/images/logo-sucofindo.png',
                        height: 44, // increased from 32
                        errorBuilder: (ctx, err, stack) => const Icon(Icons.business, color: AppColors.primary),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
      floatingActionButton: SizedBox(
        width: 64,
        height: 64,
        child: FloatingActionButton(
          onPressed: _handleAction,
          backgroundColor: AppColors.primaryDark,
          elevation: 4,
          shape: const CircleBorder(),
          child: const Icon(Icons.fingerprint, color: Colors.white, size: 34),
        ),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      bottomNavigationBar: BottomAppBar(
        color: Colors.white,
        shape: const CircularNotchedRectangle(),
        notchMargin: 8,
        padding: EdgeInsets.zero,
        child: SizedBox(
          height: 70,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              // Lembur
              _buildBottomNavItem(
                icon: Icons.access_time,
                label: 'Lembur',
                isActive: false,
                onTap: () {},
              ),
              // Absensi (Center)
              SizedBox(
                width: 80,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    Container(
                      width: 5,
                      height: 5,
                      decoration: const BoxDecoration(
                        color: AppColors.primaryDark,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Absensi',
                      style: GoogleFonts.mulish(
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                        color: AppColors.primaryDark,
                      ),
                    ),
                    const SizedBox(height: 13), // total 2+5+6 = 13 for alignment
                  ],
                ),
              ),
              // Profil
              _buildBottomNavItem(
                icon: Icons.person_outline,
                label: 'Profil',
                isActive: false,
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => const ProfilePage()),
                  );
                },
              ),
            ],
          ),
        ),
      ),
      body: SingleChildScrollView(
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
                  onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const HistoryPage())),
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
      ),
    );
  }

  Widget _buildBottomNavItem({
    required IconData icon,
    required String label,
    required bool isActive,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: SizedBox(
        width: 80,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            Icon(
              icon,
              size: 26,
              color: isActive ? AppColors.primaryDark : AppColors.textSecondary,
            ),
            if (isActive) ...[
              const SizedBox(height: 4),
              Container(
                width: 5,
                height: 5,
                decoration: const BoxDecoration(
                  color: AppColors.primaryDark,
                  shape: BoxShape.circle,
                ),
              ),
              const SizedBox(height: 4),
            ] else ...[
              const SizedBox(height: 13),
            ],
            Text(
              label,
              style: GoogleFonts.mulish(
                fontSize: 13,
                fontWeight: isActive ? FontWeight.w700 : FontWeight.w600,
                color: isActive ? AppColors.primaryDark : AppColors.textSecondary,
              ),
            ),
            const SizedBox(height: 13), // padding at bottom to align with center item
          ],
        ),
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
                child: Icon(Icons.access_time_filled, color: AppColors.primaryDark, size: 40),
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
              onPressed: _hasCheckedOut ? null : _handleAction,
              icon: const Icon(Icons.fingerprint, size: 20, color: Colors.white),
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
            valueStr: _getTotalDuration(),
          ),
        ),
      ],
    );
  }

  Widget _buildHistoryCard(Map<String, String> record) {
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
                record['dateTitle']!,
                style: GoogleFonts.mulish(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                record['time']!,
                style: GoogleFonts.mulish(
                  fontSize: 13,
                  color: AppColors.textSecondary,
                ),
              ),
            ],
          ),
          Text(
            record['duration']!,
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

  const _StatCard({required this.title, required this.icon, required this.value});

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

  const _StatCardDuration({required this.title, required this.icon, required this.valueStr});

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
          )
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
