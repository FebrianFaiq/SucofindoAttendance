import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../utils/id_date_helper.dart';
import '../theme/app_colors.dart';
import 'check_in_page.dart';
import 'check_out_page.dart';
import 'history_page.dart';
import 'login_page.dart';

class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  // Attendance state — simulates the web's hasCheckedIn / hasCheckedOut
  bool _hasCheckedIn = false;
  bool _hasCheckedOut = false;
  String? _clockInTime;
  String? _clockOutTime;

  // Live clock
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

  String _getGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 11) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  }

  String _getTodayFormatted() {
    return IdDateHelper.formatFull(DateTime.now());
  }

  String _getTotalDuration() {
    if (_clockInTime == null) return '0j 0m';
    if (_clockOutTime != null) {
      // Parse simple HH:mm
      final inParts = _clockInTime!.split(':');
      final outParts = _clockOutTime!.split(':');
      final inMinutes = int.parse(inParts[0]) * 60 + int.parse(inParts[1]);
      final outMinutes = int.parse(outParts[0]) * 60 + int.parse(outParts[1]);
      final diff = outMinutes - inMinutes;
      return '${diff ~/ 60}j ${diff % 60}m';
    }
    // Live duration
    final inParts = _clockInTime!.split(':');
    final now = DateTime.now();
    final inMinutes = int.parse(inParts[0]) * 60 + int.parse(inParts[1]);
    final nowMinutes = now.hour * 60 + now.minute;
    final diff = nowMinutes - inMinutes;
    if (diff < 0) return '0j 0m';
    return '${diff ~/ 60}j ${diff % 60}m';
  }

  void _navigateToCheckIn() async {
    final result = await Navigator.of(context).push<bool>(
      MaterialPageRoute(builder: (_) => const CheckInPage()),
    );
    if (result == true && mounted) {
      setState(() {
        _hasCheckedIn = true;
        _clockInTime = IdDateHelper.formatTime(DateTime.now());
      });
    }
  }

  void _navigateToCheckOut() async {
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

  // Static recent attendance data
  static final List<Map<String, String>> _recentAttendances = [
    {
      'date': 'Senin, 18 Agustus 2026',
      'clockIn': '07:55',
      'clockOut': '17:03',
      'status': 'Selesai',
      'mode': 'WFO',
      'project': 'PT. Telkom Indonesia',
    },
    {
      'date': 'Jumat, 15 Agustus 2026',
      'clockIn': '08:02',
      'clockOut': '17:10',
      'status': 'Selesai',
      'mode': 'WFA',
      'project': 'PT. Pertamina',
    },
    {
      'date': 'Kamis, 14 Agustus 2026',
      'clockIn': '07:48',
      'clockOut': '17:00',
      'status': 'Selesai',
      'mode': 'WFO',
      'project': 'PT. Telkom Indonesia',
    },
    {
      'date': 'Rabu, 13 Agustus 2026',
      'clockIn': '08:15',
      'clockOut': '17:22',
      'status': 'Selesai',
      'mode': 'WFO',
      'project': 'PT. Telkom Indonesia',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        elevation: 0,
        leading: Padding(
          padding: const EdgeInsets.all(10),
          child: Container(
            decoration: BoxDecoration(
              color: AppColors.primarySurface,
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Center(
              child: Icon(Icons.business, color: AppColors.primary, size: 18),
            ),
          ),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Sucofindo',
              style: GoogleFonts.mulish(
                fontSize: 16,
                fontWeight: FontWeight.w800,
                color: AppColors.textPrimary,
              ),
            ),
            Text(
              'Attendance System',
              style: GoogleFonts.mulish(
                fontSize: 11,
                fontWeight: FontWeight.w500,
                color: AppColors.textMuted,
              ),
            ),
          ],
        ),
        centerTitle: false,
        actions: [
          // Logout
          IconButton(
            icon: const Icon(Icons.logout_rounded, color: AppColors.textMuted, size: 22),
            tooltip: 'Keluar',
            onPressed: () {
              Navigator.of(context).pushAndRemoveUntil(
                MaterialPageRoute(builder: (_) => const LoginPage()),
                (_) => false,
              );
            },
          ),
          const SizedBox(width: 4),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Greeting Card ─────────────────────────────────────
            _buildGreetingCard(),
            const SizedBox(height: 16),

            // ── Clock Status Cards ────────────────────────────────
            _buildClockStatusCards(),
            const SizedBox(height: 16),

            // ── Aktivitas Terbaru ──────────────────────────────────
            _buildRecentActivitySection(),
          ],
        ),
      ),
    );
  }

  Widget _buildGreetingCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Status Badge
          _buildStatusBadge(),
          const SizedBox(height: 14),

          // Greeting
          Text(
            '${_getGreeting()}, Budi! 👋',
            style: GoogleFonts.mulish(
              fontSize: 22,
              fontWeight: FontWeight.w800,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            '${_getTodayFormatted()} • ${_getStatusText()}',
            style: GoogleFonts.mulish(
              fontSize: 13,
              color: AppColors.textSecondary,
              height: 1.4,
            ),
          ),
          const SizedBox(height: 18),

          // Action Button
          if (!_hasCheckedIn)
            _buildActionButton(
              icon: Icons.login_rounded,
              label: 'Absen Hari Ini',
              onTap: _navigateToCheckIn,
            )
          else if (!_hasCheckedOut)
            _buildActionButton(
              icon: Icons.logout_rounded,
              label: 'Clock Out',
              onTap: _navigateToCheckOut,
            ),

          if (_hasCheckedIn) ...[
            const SizedBox(height: 10),
            Row(
              children: [
                const Icon(Icons.location_on, size: 14, color: AppColors.textMuted),
                const SizedBox(width: 4),
                Text(
                  'Lokasi terdeteksi: Jakarta Selatan',
                  style: GoogleFonts.mulish(
                    fontSize: 11,
                    color: AppColors.textMuted,
                  ),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildStatusBadge() {
    if (!_hasCheckedIn) {
      return _badge(
        icon: Icons.access_time,
        text: 'Belum Absen Hari Ini',
        bgColor: AppColors.divider,
        textColor: AppColors.textSecondary,
      );
    }
    if (_hasCheckedOut) {
      return _badge(
        icon: null,
        dotColor: AppColors.success,
        text: 'Sudah Selesai',
        bgColor: AppColors.successLight,
        textColor: AppColors.success,
      );
    }
    return _badge(
      icon: null,
      dotColor: AppColors.primary,
      text: 'Sedang Bekerja',
      bgColor: AppColors.primaryLight,
      textColor: AppColors.primary,
    );
  }

  Widget _badge({
    IconData? icon,
    Color? dotColor,
    required String text,
    required Color bgColor,
    required Color textColor,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null)
            Padding(
              padding: const EdgeInsets.only(right: 6),
              child: Icon(icon, size: 14, color: textColor),
            ),
          if (dotColor != null)
            Padding(
              padding: const EdgeInsets.only(right: 6),
              child: Container(
                width: 6,
                height: 6,
                decoration: BoxDecoration(
                  color: dotColor,
                  shape: BoxShape.circle,
                ),
              ),
            ),
          Text(
            text,
            style: GoogleFonts.mulish(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: textColor,
            ),
          ),
        ],
      ),
    );
  }

  String _getStatusText() {
    if (!_hasCheckedIn) return 'Silakan lakukan Clock In untuk memulai aktivitas.';
    if (_hasCheckedOut) return 'Anda sudah menyelesaikan hari kerja.';
    return 'Anda sedang bekerja. Jangan lupa Clock Out nanti.';
  }

  Widget _buildActionButton({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return SizedBox(
      width: double.infinity,
      height: 48,
      child: ElevatedButton.icon(
        onPressed: onTap,
        icon: Icon(icon, size: 18),
        label: Text(label),
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          foregroundColor: Colors.white,
          elevation: 4,
          shadowColor: AppColors.primary.withValues(alpha: 0.3),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: GoogleFonts.mulish(
            fontSize: 14,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }

  Widget _buildClockStatusCards() {
    return Row(
      children: [
        // Clock In
        Expanded(
          child: _StatusCard(
            label: 'Clock In',
            value: _clockInTime ?? '--:--',
            icon: Icons.login_rounded,
            iconBgColor: AppColors.successLight,
            iconColor: AppColors.success,
          ),
        ),
        const SizedBox(width: 10),
        // Clock Out
        Expanded(
          child: _StatusCard(
            label: 'Clock Out',
            value: _clockOutTime ?? '--:--',
            icon: Icons.logout_rounded,
            iconBgColor: AppColors.dangerLight,
            iconColor: AppColors.danger,
          ),
        ),
        const SizedBox(width: 10),
        // Total Durasi
        Expanded(
          child: _StatusCard(
            label: 'Total Durasi',
            value: _getTotalDuration(),
            icon: Icons.schedule_rounded,
            iconBgColor: AppColors.primaryLight,
            iconColor: AppColors.primary,
          ),
        ),
      ],
    );
  }

  Widget _buildRecentActivitySection() {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: [
          // Header
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Aktivitas Terbaru',
                  style: GoogleFonts.mulish(
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textPrimary,
                  ),
                ),
                GestureDetector(
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(builder: (_) => const HistoryPage()),
                    );
                  },
                  child: Row(
                    children: [
                      Text(
                        'Lihat Semua',
                        style: GoogleFonts.mulish(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: AppColors.primary,
                        ),
                      ),
                      const SizedBox(width: 4),
                      const Icon(Icons.arrow_forward, size: 14, color: AppColors.primary),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const Divider(height: 1, color: AppColors.divider),

          // Activity List
          ..._recentAttendances.map((record) => _ActivityTile(record: record)),
        ],
      ),
    );
  }
}

// ─── Status Card Widget ───────────────────────────────────────────────────

class _StatusCard extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final Color iconBgColor;
  final Color iconColor;

  const _StatusCard({
    required this.label,
    required this.value,
    required this.icon,
    required this.iconBgColor,
    required this.iconColor,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  label,
                  style: GoogleFonts.mulish(
                    fontSize: 10,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textMuted,
                    letterSpacing: 0.5,
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  color: iconBgColor,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(icon, size: 16, color: iconColor),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: GoogleFonts.mulish(
              fontSize: 20,
              fontWeight: FontWeight.w700,
              color: AppColors.textPrimary,
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Activity Tile Widget ─────────────────────────────────────────────────

class _ActivityTile extends StatelessWidget {
  final Map<String, String> record;

  const _ActivityTile({required this.record});

  @override
  Widget build(BuildContext context) {
    final isComplete = record['status'] == 'Selesai';

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: const BoxDecoration(
        border: Border(bottom: BorderSide(color: AppColors.divider)),
      ),
      child: Row(
        children: [
          // Date & Time column
          Expanded(
            flex: 3,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  record['date']!,
                  style: GoogleFonts.mulish(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    Text(
                      '${record['clockIn']} - ${record['clockOut']}',
                      style: GoogleFonts.mulish(
                        fontSize: 12,
                        color: AppColors.textSecondary,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: isComplete ? AppColors.successLight : AppColors.warningLight,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Container(
                            width: 5,
                            height: 5,
                            decoration: BoxDecoration(
                              color: isComplete ? AppColors.success : AppColors.warning,
                              shape: BoxShape.circle,
                            ),
                          ),
                          const SizedBox(width: 4),
                          Text(
                            record['status']!,
                            style: GoogleFonts.mulish(
                              fontSize: 10,
                              fontWeight: FontWeight.w600,
                              color: isComplete ? AppColors.success : AppColors.warning,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          // Mode & Project column
          Expanded(
            flex: 2,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: AppColors.infoLight,
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    record['mode']!,
                    style: GoogleFonts.mulish(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      color: AppColors.info,
                    ),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  record['project']!,
                  style: GoogleFonts.mulish(
                    fontSize: 10,
                    color: AppColors.textMuted,
                  ),
                  textAlign: TextAlign.end,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
