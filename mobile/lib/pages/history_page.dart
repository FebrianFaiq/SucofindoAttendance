import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_colors.dart';

class HistoryPage extends StatelessWidget {
  const HistoryPage({super.key});

  // Static attendance history data
  static final List<Map<String, String>> _historyData = [
    {
      'date': 'Senin, 18 Agustus 2026',
      'clockIn': '07:55',
      'clockOut': '17:03',
      'status': 'Selesai',
      'mode': 'WFO',
      'project': 'PT. Telkom Indonesia',
      'duration': '9j 8m',
    },
    {
      'date': 'Jumat, 15 Agustus 2026',
      'clockIn': '08:02',
      'clockOut': '17:10',
      'status': 'Selesai',
      'mode': 'WFA',
      'project': 'PT. Pertamina',
      'duration': '9j 8m',
    },
    {
      'date': 'Kamis, 14 Agustus 2026',
      'clockIn': '07:48',
      'clockOut': '17:00',
      'status': 'Selesai',
      'mode': 'WFO',
      'project': 'PT. Telkom Indonesia',
      'duration': '9j 12m',
    },
    {
      'date': 'Rabu, 13 Agustus 2026',
      'clockIn': '08:15',
      'clockOut': '17:22',
      'status': 'Selesai',
      'mode': 'WFO',
      'project': 'PT. Telkom Indonesia',
      'duration': '9j 7m',
    },
    {
      'date': 'Selasa, 12 Agustus 2026',
      'clockIn': '07:50',
      'clockOut': '17:05',
      'status': 'Selesai',
      'mode': 'WFA',
      'project': 'PT. PLN',
      'duration': '9j 15m',
    },
    {
      'date': 'Senin, 11 Agustus 2026',
      'clockIn': '07:45',
      'clockOut': '17:30',
      'status': 'Selesai',
      'mode': 'WFO',
      'project': 'PT. Telkom Indonesia',
      'duration': '9j 45m',
    },
    {
      'date': 'Jumat, 8 Agustus 2026',
      'clockIn': '08:10',
      'clockOut': '17:15',
      'status': 'Selesai',
      'mode': 'WFO',
      'project': 'PT. Pertamina',
      'duration': '9j 5m',
    },
    {
      'date': 'Kamis, 7 Agustus 2026',
      'clockIn': '07:58',
      'clockOut': '17:02',
      'status': 'Selesai',
      'mode': 'WFO',
      'project': 'PT. Telkom Indonesia',
      'duration': '9j 4m',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded, color: AppColors.textSecondary),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: Text(
          'Riwayat Kehadiran',
          style: GoogleFonts.mulish(
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: AppColors.textPrimary,
          ),
        ),
        centerTitle: true,
      ),
      body: Column(
        children: [
          // ── Summary Header ────────────────────────────────────
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            color: AppColors.surface,
            child: Row(
              children: [
                _SummaryChip(
                  icon: Icons.calendar_today,
                  iconColor: AppColors.primary,
                  label: 'Total',
                  value: '${_historyData.length} Hari',
                ),
                const SizedBox(width: 12),
                _SummaryChip(
                  icon: Icons.check_circle_outline,
                  iconColor: AppColors.success,
                  label: 'Hadir',
                  value: '${_historyData.length} Hari',
                ),
                const SizedBox(width: 12),
                _SummaryChip(
                  icon: Icons.cancel_outlined,
                  iconColor: AppColors.danger,
                  label: 'Absen',
                  value: '0 Hari',
                ),
              ],
            ),
          ),
          const Divider(height: 1, color: AppColors.divider),

          // ── History List ──────────────────────────────────────
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _historyData.length,
              itemBuilder: (context, index) {
                final record = _historyData[index];
                return _HistoryCard(record: record);
              },
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Summary Chip ─────────────────────────────────────────────────────────

class _SummaryChip extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final String label;
  final String value;

  const _SummaryChip({
    required this.icon,
    required this.iconColor,
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 10),
        decoration: BoxDecoration(
          color: AppColors.background,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: AppColors.border),
        ),
        child: Column(
          children: [
            Icon(icon, size: 18, color: iconColor),
            const SizedBox(height: 6),
            Text(
              value,
              style: GoogleFonts.mulish(
                fontSize: 14,
                fontWeight: FontWeight.w700,
                color: AppColors.textPrimary,
              ),
            ),
            Text(
              label,
              style: GoogleFonts.mulish(
                fontSize: 10,
                fontWeight: FontWeight.w500,
                color: AppColors.textMuted,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── History Card ─────────────────────────────────────────────────────────

class _HistoryCard extends StatelessWidget {
  final Map<String, String> record;

  const _HistoryCard({required this.record});

  @override
  Widget build(BuildContext context) {
    final isLate = int.parse(record['clockIn']!.split(':')[0]) >= 8 &&
        int.parse(record['clockIn']!.split(':')[1]) > 0;

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Date Row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                record['date']!,
                style: GoogleFonts.mulish(
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
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
            ],
          ),
          const SizedBox(height: 12),

          // Clock In / Clock Out / Duration Row
          Row(
            children: [
              // Clock In
              _TimeBlock(
                label: 'Clock In',
                value: record['clockIn']!,
                icon: Icons.login_rounded,
                iconColor: isLate ? AppColors.danger : AppColors.success,
              ),
              const SizedBox(width: 16),
              // Clock Out
              _TimeBlock(
                label: 'Clock Out',
                value: record['clockOut']!,
                icon: Icons.logout_rounded,
                iconColor: AppColors.textSecondary,
              ),
              const SizedBox(width: 16),
              // Duration
              _TimeBlock(
                label: 'Durasi',
                value: record['duration']!,
                icon: Icons.schedule_rounded,
                iconColor: AppColors.primary,
              ),
              const Spacer(),
              // Status
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.successLight,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 5,
                      height: 5,
                      decoration: const BoxDecoration(
                        color: AppColors.success,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      record['status']!,
                      style: GoogleFonts.mulish(
                        fontSize: 10,
                        fontWeight: FontWeight.w600,
                        color: AppColors.success,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),

          // Project
          Row(
            children: [
              const Icon(Icons.folder_outlined, size: 13, color: AppColors.textMuted),
              const SizedBox(width: 4),
              Text(
                record['project']!,
                style: GoogleFonts.mulish(
                  fontSize: 11,
                  color: AppColors.textMuted,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

// ─── Time Block ───────────────────────────────────────────────────────────

class _TimeBlock extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final Color iconColor;

  const _TimeBlock({
    required this.label,
    required this.value,
    required this.icon,
    required this.iconColor,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: GoogleFonts.mulish(
            fontSize: 9,
            fontWeight: FontWeight.w600,
            color: AppColors.textMuted,
            letterSpacing: 0.5,
          ),
        ),
        const SizedBox(height: 3),
        Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 13, color: iconColor),
            const SizedBox(width: 4),
            Text(
              value,
              style: GoogleFonts.mulish(
                fontSize: 13,
                fontWeight: FontWeight.w700,
                color: AppColors.textPrimary,
              ),
            ),
          ],
        ),
      ],
    );
  }
}
