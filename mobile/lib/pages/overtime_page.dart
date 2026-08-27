import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_colors.dart';
import '../widgets/custom_app_bar.dart';
import '../widgets/custom_bottom_nav_bar.dart';
import 'overtime_form_page.dart';
import 'dashboard_page.dart';
import '../services/overtime_service.dart';

class OvertimePage extends StatefulWidget {
  const OvertimePage({super.key});

  @override
  State<OvertimePage> createState() => _OvertimePageState();
}

class _OvertimePageState extends State<OvertimePage> {
  int _currentPage = 1;
  int _lastPage = 1;
  bool _isLoading = false;
  List<dynamic> _riwayatLembur = [];

  @override
  void initState() {
    super.initState();
    _fetchOvertimes();
  }

  Future<void> _fetchOvertimes({bool loadMore = false}) async {
    if (_isLoading) return;
    if (loadMore && _currentPage >= _lastPage) return;

    setState(() => _isLoading = true);

    final nextPage = loadMore ? _currentPage + 1 : 1;
    final result = await OvertimeService.getOvertimes(page: nextPage);

    if (result['success'] == true) {
      setState(() {
        if (loadMore) {
          _riwayatLembur.addAll(result['data']);
        } else {
          _riwayatLembur = result['data'];
        }
        _currentPage = result['meta']['current_page'];
        _lastPage = result['meta']['last_page'];
      });
    }

    if (mounted) {
      setState(() => _isLoading = false);
    }
  }

  void _navigateToForm() async {
    await Navigator.of(context).push(
      MaterialPageRoute(builder: (_) => const OvertimeFormPage()),
    );
  }

  @override
  Widget build(BuildContext context) {
    int _totalHariIni = 0;
    int _totalMinutes = 0;
    String _statusTerakhir = 'Belum Ada Data';

    if (_riwayatLembur.isNotEmpty) {
      _statusTerakhir = _riwayatLembur.first['status'] ?? 'Pending';
      final now = DateTime.now();
      for (var item in _riwayatLembur) {
        if (item['date'] != null) {
          final dt = DateTime.tryParse(item['date']);
          if (dt != null && dt.year == now.year && dt.month == now.month && dt.day == now.day) {
            _totalHariIni++;
          }
        }
        if (item['start_time'] != null && item['end_time'] != null) {
           final inParts = item['start_time'].toString().split(':');
           final outParts = item['end_time'].toString().split(':');
           if (inParts.length >= 2 && outParts.length >= 2) {
             final inMinutes = int.parse(inParts[0]) * 60 + int.parse(inParts[1]);
             final outMinutes = int.parse(outParts[0]) * 60 + int.parse(outParts[1]);
             _totalMinutes += (outMinutes - inMinutes);
           }
        }
      }
    }
    
    String _totalDurasi = '${_totalMinutes ~/ 60}j ${_totalMinutes % 60}m';

    return Scaffold(
      backgroundColor: const Color(0xFFF9F9FF),
      appBar: const CustomAppBar(),
      floatingActionButton: SizedBox(
        width: 64,
        height: 64,
        child: FloatingActionButton(
          onPressed: () {
            // Navigate to dashboard (Absensi)
            Navigator.of(context).pushReplacement(
              MaterialPageRoute(builder: (_) => const DashboardPage()),
            );
          },
          backgroundColor: AppColors.textSecondary,
          elevation: 4,
          shape: const CircleBorder(),
          child: const Icon(Icons.fingerprint, color: Colors.white, size: 34),
        ),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      bottomNavigationBar: const CustomBottomNavBar(selectedIndex: 0),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Header Text ──────────────────────────────────────
            Text(
              'Lembur',
              style: GoogleFonts.mulish(
                fontSize: 24,
                fontWeight: FontWeight.w800,
                color: AppColors.primaryDark,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              'Riwayat dan catatan lembur Anda.',
              style: GoogleFonts.mulish(
                fontSize: 14,
                color: AppColors.textSecondary,
              ),
            ),
            const SizedBox(height: 24),

            // ── Summary Cards ──────────────────────────────────────
            Row(
              children: [
                // Total Hari Ini
                Expanded(
                  child: _buildSummaryCard(
                    icon: Icons.calendar_today_outlined,
                    label: 'Total Hari Ini',
                    value: '$_totalHariIni',
                    unit: 'Jam',
                  ),
                ),
                const SizedBox(width: 12),
                // Total Durasi
                Expanded(
                  child: _buildSummaryCard(
                    icon: Icons.access_time,
                    label: 'Total Durasi',
                    value: _totalDurasi,
                    unit: null,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // ── Status Terakhir ────────────────────────────────────
            _buildStatusTerakhirCard(_statusTerakhir),
            const SizedBox(height: 20),

            // ── Button Ajukan Lembur ───────────────────────────────
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton.icon(
                onPressed: _navigateToForm,
                icon: const Icon(Icons.add, size: 20, color: Colors.white),
                label: Text(
                  'Ajukan Lembur',
                  style: GoogleFonts.mulish(
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                    color: Colors.white,
                  ),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primaryDark,
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 28),

            // ── Riwayat Lembur ─────────────────────────────────────
            Text(
              'Riwayat Lembur',
              style: GoogleFonts.mulish(
                fontSize: 18,
                fontWeight: FontWeight.w800,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: 16),
            ..._riwayatLembur.map((item) => _buildRiwayatCard(item)),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }


  // ── Summary Card ─────────────────────────────────────────────────
  Widget _buildSummaryCard({
    required IconData icon,
    required String label,
    required String value,
    String? unit,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 18, horizontal: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border.withOpacity(0.6)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 15, color: AppColors.textSecondary),
              const SizedBox(width: 6),
              Text(
                label,
                style: GoogleFonts.mulish(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textSecondary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            crossAxisAlignment: CrossAxisAlignment.baseline,
            textBaseline: TextBaseline.alphabetic,
            children: [
              Text(
                value,
                style: GoogleFonts.mulish(
                  fontSize: 24,
                  fontWeight: FontWeight.w800,
                  color: AppColors.textPrimary,
                ),
              ),
              if (unit != null) ...[
                const SizedBox(width: 4),
                Text(
                  unit,
                  style: GoogleFonts.mulish(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ],
          ),
        ],
      ),
    );
  }

  // ── Status Terakhir Card ─────────────────────────────────────────
  Widget _buildStatusTerakhirCard(String status) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border.withOpacity(0.6)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Icon(Icons.assignment_outlined, size: 18, color: AppColors.textSecondary),
              const SizedBox(width: 8),
              Text(
                'Status Terakhir',
                style: GoogleFonts.mulish(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textSecondary,
                ),
              ),
            ],
          ),
          _buildStatusBadge(status),
        ],
      ),
    );
  }

  // ── Status Badge ─────────────────────────────────────────────────
  Widget _buildStatusBadge(String status) {
    final isSudah = status == 'Sudah Direview';
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: isSudah ? AppColors.primaryLight : const Color(0xFFFFF7ED),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isSudah
              ? AppColors.primary.withOpacity(0.3)
              : const Color(0xFFFDBA74),
        ),
      ),
      child: Text(
        status,
        style: GoogleFonts.mulish(
          fontSize: 12,
          fontWeight: FontWeight.w700,
          color: isSudah ? AppColors.primary : const Color(0xFFEA580C),
        ),
      ),
    );
  }

  // ── Riwayat Card ─────────────────────────────────────────────────
  Widget _buildRiwayatCard(dynamic item) {
    String duration = '--';
    if (item['start_time'] != null && item['end_time'] != null) {
      final inParts = item['start_time'].toString().split(':');
      final outParts = item['end_time'].toString().split(':');
      if (inParts.length >= 2 && outParts.length >= 2) {
        final inMinutes = int.parse(inParts[0]) * 60 + int.parse(inParts[1]);
        final outMinutes = int.parse(outParts[0]) * 60 + int.parse(outParts[1]);
        final diff = outMinutes - inMinutes;
        duration = '${diff ~/ 60}j ${diff % 60}m';
      }
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border.withOpacity(0.6)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Date & Status row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Icon(Icons.calendar_today_outlined, size: 15, color: AppColors.textSecondary),
                  const SizedBox(width: 6),
                  Text(
                    item['date'] ?? '-',
                    style: GoogleFonts.mulish(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textPrimary,
                    ),
                  ),
                ],
              ),
              _buildStatusBadge(item['status'] ?? 'Pending'),
            ],
          ),
          const SizedBox(height: 16),

          // Description row
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Keterangan',
                style: GoogleFonts.mulish(
                  fontSize: 12,
                  color: AppColors.textMuted,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                item['description'] ?? '-',
                style: GoogleFonts.mulish(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Durasi
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Durasi',
                style: GoogleFonts.mulish(
                  fontSize: 12,
                  color: AppColors.textMuted,
                ),
              ),
              const SizedBox(height: 2),
              Row(
                children: [
                  Icon(Icons.access_time, size: 16, color: AppColors.primary),
                  const SizedBox(width: 4),
                  Text(
                    duration,
                    style: GoogleFonts.mulish(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: AppColors.primaryDark,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }
}
