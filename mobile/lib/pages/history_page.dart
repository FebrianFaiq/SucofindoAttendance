import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'profile_page.dart';
import '../theme/app_colors.dart';

class HistoryPage extends StatefulWidget {
  const HistoryPage({super.key});

  @override
  State<HistoryPage> createState() => _HistoryPageState();
}

class _HistoryPageState extends State<HistoryPage> {
  int _selectedNavIndex = 1; // Absensi active
  int _visibleCount = 4;

  static final List<Map<String, String>> _historyData = [
    {
      'date': 'Senin, 20 Nov 2023',
      'clockIn': '07:45',
      'clockOut': '17:10',
      'mode': 'WFA',
      'duration': '9h 25m',
    },
    {
      'date': 'Jumat, 17 Nov 2023',
      'clockIn': '08:15',
      'clockOut': '17:05',
      'mode': 'WFO',
      'duration': '8h 50m',
    },
    {
      'date': 'Kamis, 16 Nov 2023',
      'clockIn': '07:50',
      'clockOut': '17:00',
      'mode': 'WFA',
      'duration': '9h 10m',
    },
    {
      'date': 'Rabu, 15 Nov 2023',
      'clockIn': '07:55',
      'clockOut': '18:30',
      'mode': 'WFA',
      'duration': '10h 35m',
    },
    {
      'date': 'Selasa, 14 Nov 2023',
      'clockIn': '07:40',
      'clockOut': '17:00',
      'mode': 'WFO',
      'duration': '9h 20m',
    },
    {
      'date': 'Senin, 13 Nov 2023',
      'clockIn': '08:00',
      'clockOut': '17:15',
      'mode': 'WFO',
      'duration': '9h 15m',
    },
    {
      'date': 'Jumat, 10 Nov 2023',
      'clockIn': '07:50',
      'clockOut': '17:20',
      'mode': 'WFA',
      'duration': '9h 30m',
    },
    {
      'date': 'Kamis, 9 Nov 2023',
      'clockIn': '07:58',
      'clockOut': '17:02',
      'mode': 'WFO',
      'duration': '9h 4m',
    },
  ];

  void _loadMore() {
    setState(() {
      _visibleCount = (_visibleCount + 4).clamp(0, _historyData.length);
    });
  }

  @override
  Widget build(BuildContext context) {
    final visibleItems = _historyData.take(_visibleCount).toList();

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
                      padding: const EdgeInsets.only(right: 48),
                      child: Image.asset(
                        'assets/images/logo-sucofindo.png',
                        height: 44,
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
          onPressed: () {},
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
              _buildBottomNavItem(
                icon: Icons.access_time,
                label: 'Lembur',
                isActive: _selectedNavIndex == 0,
                onTap: () => setState(() => _selectedNavIndex = 0),
              ),
              SizedBox(
                width: 80,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    const SizedBox(height: 9), // 5 (dot) + 4 (spacing) = 9 to maintain alignment with active state
                    Text(
                      'Absensi',
                      style: GoogleFonts.mulish(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textSecondary, // Inactive in design
                      ),
                    ),
                    const SizedBox(height: 13),
                  ],
                ),
              ),
              _buildBottomNavItem(
                icon: Icons.person_outline,
                label: 'Profil',
                isActive: _selectedNavIndex == 2,
                onTap: () {
                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(builder: (context) => const ProfilePage()),
                  );
                },
              ),
            ],
          ),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        children: [
          // Month Header
          Text(
            'NOVEMBER 2023',
            style: GoogleFonts.mulish(
              fontSize: 12,
              fontWeight: FontWeight.w800,
              color: AppColors.textSecondary,
              letterSpacing: 0.5,
            ),
          ),
          const SizedBox(height: 16),

          // History Cards
          ...visibleItems.map((record) => _buildHistoryCard(record)),

          // Load More
          if (_visibleCount < _historyData.length) ...[
            const SizedBox(height: 8),
            Center(
              child: GestureDetector(
                onTap: _loadMore,
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  child: Text(
                    'Muat Lebih Banyak',
                    style: GoogleFonts.mulish(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: AppColors.primary,
                    ),
                  ),
                ),
              ),
            ),
          ],
          const SizedBox(height: 16),
        ],
      ),
    );
  }

  Widget _buildHistoryCard(Map<String, String> record) {
    final isLate = int.parse(record['clockIn']!.split(':')[0]) >= 8 &&
        int.parse(record['clockIn']!.split(':')[1]) > 0;

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border, width: 1.2),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Date + Mode badge
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Text(
                record['date']!,
                style: GoogleFonts.mulish(
                  fontSize: 15,
                  fontWeight: FontWeight.w800,
                  color: AppColors.textPrimary,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: record['mode'] == 'WFO'
                      ? AppColors.primary.withOpacity(0.1)
                      : AppColors.primaryDark.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(
                    color: record['mode'] == 'WFO'
                        ? AppColors.primary.withOpacity(0.3)
                        : AppColors.primaryDark.withOpacity(0.3),
                  ),
                ),
                child: Text(
                  record['mode']!,
                  style: GoogleFonts.mulish(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: AppColors.primaryDark,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          const Divider(height: 1, color: AppColors.border),
          const SizedBox(height: 16),

          // Clock In / Clock Out / Duration
          Row(
            children: [
              Expanded(
                child: _buildTimeColumn(
                  'Clock In',
                  record['clockIn']!,
                  isLate ? AppColors.danger : AppColors.textPrimary,
                ),
              ),
              Expanded(
                child: _buildTimeColumn(
                  'Clock Out',
                  record['clockOut']!,
                  AppColors.textPrimary,
                ),
              ),
              Expanded(
                child: _buildTimeColumn(
                  'Durasi',
                  record['duration']!,
                  AppColors.primaryDark,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildTimeColumn(String label, String value, Color valueColor) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: GoogleFonts.mulish(
            fontSize: 11,
            fontWeight: FontWeight.w600,
            color: AppColors.textSecondary,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: GoogleFonts.mulish(
            fontSize: 16,
            fontWeight: FontWeight.w800,
            color: valueColor,
          ),
        ),
      ],
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
            const SizedBox(height: 13),
          ],
        ),
      ),
    );
  }
}
