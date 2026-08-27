import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_colors.dart';
import '../widgets/custom_app_bar.dart';
import '../widgets/custom_bottom_nav_bar.dart';
import 'main_page.dart';
import '../services/attendance_service.dart';

class HistoryPage extends StatefulWidget {
  const HistoryPage({super.key});

  @override
  State<HistoryPage> createState() => _HistoryPageState();
}
class _HistoryPageState extends State<HistoryPage> {
  int _currentPage = 1;
  int _lastPage = 1;
  bool _isLoading = false;
  List<dynamic> _historyData = [];

  @override
  void initState() {
    super.initState();
    _fetchHistory();
  }

  Future<void> _fetchHistory({bool loadMore = false}) async {
    if (_isLoading) return;
    if (loadMore && _currentPage >= _lastPage) return;

    setState(() => _isLoading = true);

    final nextPage = loadMore ? _currentPage + 1 : 1;
    final result = await AttendanceService.getHistory(page: nextPage);

    if (result['success'] == true) {
      setState(() {
        if (loadMore) {
          _historyData.addAll(result['data']);
        } else {
          _historyData = result['data'];
        }
        _currentPage = result['meta']['current_page'];
        _lastPage = result['meta']['last_page'];
      });
    }

    if (mounted) {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final visibleItems = _historyData;

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
      bottomNavigationBar: CustomBottomNavBar(
        selectedIndex: 1,
        onItemTapped: (index) {
          if (index != 1) {
            Navigator.of(context).pushAndRemoveUntil(
              MaterialPageRoute(builder: (_) => MainPage(initialIndex: index)),
              (route) => false,
            );
          }
        },
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
          if (_currentPage < _lastPage) ...[
            const SizedBox(height: 8),
            Center(
              child: GestureDetector(
                onTap: () => _fetchHistory(loadMore: true),
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  child: _isLoading 
                    ? const CircularProgressIndicator()
                    : Text(
                        'Muat Lebih Banyak',
                        style: GoogleFonts.mulish(
                          fontSize: 13,
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

  Widget _buildHistoryCard(dynamic record) {
    bool isLate = false;
    if (record['clock_in'] != null) {
      final parts = record['clock_in'].toString().split(':');
      if (parts.length >= 2) {
        isLate = int.parse(parts[0]) >= 8 && int.parse(parts[1]) > 0;
      }
    }

    String duration = '--';
    if (record['clock_in'] != null && record['clock_out'] != null) {
      final inParts = record['clock_in'].toString().split(':');
      final outParts = record['clock_out'].toString().split(':');
      if (inParts.length >= 2 && outParts.length >= 2) {
        final inMinutes = int.parse(inParts[0]) * 60 + int.parse(inParts[1]);
        final outMinutes = int.parse(outParts[0]) * 60 + int.parse(outParts[1]);
        final diff = outMinutes - inMinutes;
        duration = '${diff ~/ 60}j ${diff % 60}m';
      }
    }

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
                record['date'] ?? '-',
                style: GoogleFonts.mulish(
                  fontSize: 15,
                  fontWeight: FontWeight.w800,
                  color: AppColors.textPrimary,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: record['type'] == 'WFO'
                      ? AppColors.primary.withOpacity(0.1)
                      : AppColors.primaryDark.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(
                    color: record['type'] == 'WFO'
                        ? AppColors.primary.withOpacity(0.3)
                        : AppColors.primaryDark.withOpacity(0.3),
                  ),
                ),
                child: Text(
                  record['type'] ?? '-',
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
                  record['clock_in'] ?? '--:--',
                  isLate ? AppColors.danger : AppColors.textPrimary,
                ),
              ),
              Expanded(
                child: _buildTimeColumn(
                  'Clock Out',
                  record['clock_out'] ?? '--:--',
                  AppColors.textPrimary,
                ),
              ),
              Expanded(
                child: _buildTimeColumn(
                  'Durasi',
                  duration,
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
