import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_colors.dart';
import '../widgets/custom_app_bar.dart';
import '../widgets/custom_bottom_nav_bar.dart';

class HistoryPage extends StatefulWidget {
  const HistoryPage({super.key});

  @override
  State<HistoryPage> createState() => _HistoryPageState();
}

class _HistoryPageState extends State<HistoryPage> {
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
      appBar: const CustomAppBar(),
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
      bottomNavigationBar: const CustomBottomNavBar(selectedIndex: 1),
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

}
