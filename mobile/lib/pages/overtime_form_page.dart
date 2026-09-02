import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:table_calendar/table_calendar.dart';
import '../theme/app_colors.dart';
import '../widgets/custom_app_bar.dart';
import '../services/overtime_service.dart';

class OvertimeFormPage extends StatefulWidget {
  const OvertimeFormPage({super.key});

  @override
  State<OvertimeFormPage> createState() => _OvertimeFormPageState();
}

class _OvertimeFormPageState extends State<OvertimeFormPage> {
  DateTime? _selectedDate;
  TimeOfDay? _startTime;
  TimeOfDay? _endTime;

  final _tempatController = TextEditingController();
  final _pelangganController = TextEditingController();
  final _nomorOrderController = TextEditingController();

  final List<Map<String, dynamic>> _tasks = List.generate(
    4,
    (index) => {
      'startTime': null,
      'endTime': null,
      'controller': TextEditingController(),
    },
  );

  List<String> _holidayDates = [];
  bool _isSubmitting = false;

  @override
  void initState() {
    super.initState();
    _fetchHolidays();
  }

  Future<void> _fetchHolidays() async {
    final res = await OvertimeService.getHolidays();
    if (res['success'] == true) {
      final List data = res['data'];
      if (mounted) {
        setState(() {
          _holidayDates = data.map((e) => e['date'].toString()).toList();
        });
      }
    }
  }

  @override
  void dispose() {
    _tempatController.dispose();
    _pelangganController.dispose();
    _nomorOrderController.dispose();
    for (var task in _tasks) {
      task['controller'].dispose();
    }
    super.dispose();
  }

  String _formatDate(DateTime? date) {
    if (date == null) return 'mm/dd/yyyy';
    return '${date.month.toString().padLeft(2, '0')}/${date.day.toString().padLeft(2, '0')}/${date.year}';
  }

  String _formatTime(TimeOfDay? time) {
    if (time == null) return '--:-- --';
    final hour = time.hourOfPeriod == 0 ? 12 : time.hourOfPeriod;
    final period = time.period == DayPeriod.am ? 'AM' : 'PM';
    return '${hour.toString().padLeft(2, '0')}:${time.minute.toString().padLeft(2, '0')} $period';
  }

  String _formatTimeOnly24h(TimeOfDay? time) {
    if (time == null) return '--:--';
    return '${time.hour.toString().padLeft(2, '0')}:${time.minute.toString().padLeft(2, '0')}';
  }

  String _getDuration() {
    if (_startTime == null || _endTime == null) return '0 Jam 0 Menit';
    final startMinutes = _startTime!.hour * 60 + _startTime!.minute;
    final endMinutes = _endTime!.hour * 60 + _endTime!.minute;
    int diff = endMinutes - startMinutes;
    if (diff < 0) diff += 24 * 60; // handle overnight
    final hours = diff ~/ 60;
    final minutes = diff % 60;
    return '$hours Jam $minutes Menit';
  }

  Future<void> _pickDate() async {
    DateTime focusedDay = _selectedDate ?? DateTime.now();
    DateTime? tempSelectedDay = _selectedDate;

    final selected = await showDialog<DateTime>(
      context: context,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setStateBuilder) {
            return Dialog(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
              child: Container(
                padding: const EdgeInsets.all(16),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    TableCalendar(
                      firstDay: DateTime(2020),
                      lastDay: DateTime(2030),
                      focusedDay: focusedDay,
                      selectedDayPredicate: (day) =>
                          isSameDay(tempSelectedDay, day),
                      onDaySelected: (selected, focused) {
                        setStateBuilder(() {
                          tempSelectedDay = selected;
                          focusedDay = focused;
                        });
                      },
                      calendarBuilders: CalendarBuilders(
                        defaultBuilder: (context, day, focusedDay) {
                          final dateStr =
                              '${day.year}-${day.month.toString().padLeft(2, '0')}-${day.day.toString().padLeft(2, '0')}';
                          final isHoliday =
                              day.weekday == DateTime.saturday ||
                              day.weekday == DateTime.sunday ||
                              _holidayDates.contains(dateStr);

                          return Center(
                            child: Text(
                              '${day.day}',
                              style: TextStyle(
                                color: isHoliday
                                    ? Colors.red
                                    : AppColors.textPrimary,
                                fontWeight: isHoliday
                                    ? FontWeight.bold
                                    : FontWeight.normal,
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        TextButton(
                          onPressed: () => Navigator.pop(context),
                          child: const Text('Batal'),
                        ),
                        ElevatedButton(
                          onPressed: () =>
                              Navigator.pop(context, tempSelectedDay),
                          child: const Text('Pilih'),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );

    if (selected != null) {
      setState(() => _selectedDate = selected);
    }
  }

  Future<void> _pickTime({required bool isStart, int? taskIndex}) async {
    TimeOfDay initial;
    if (taskIndex != null) {
      initial = isStart
          ? (_tasks[taskIndex]['startTime'] ??
                const TimeOfDay(hour: 17, minute: 0))
          : (_tasks[taskIndex]['endTime'] ??
                const TimeOfDay(hour: 19, minute: 0));
    } else {
      initial = isStart
          ? (_startTime ?? const TimeOfDay(hour: 17, minute: 0))
          : (_endTime ?? const TimeOfDay(hour: 19, minute: 0));
    }

    final picked = await showTimePicker(
      context: context,
      initialTime: initial,
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: const ColorScheme.light(
              primary: AppColors.primary,
              onPrimary: Colors.white,
              surface: Colors.white,
              onSurface: AppColors.textPrimary,
            ),
          ),
          child: child!,
        );
      },
    );

    if (picked != null) {
      setState(() {
        if (taskIndex != null) {
          if (isStart) {
            _tasks[taskIndex]['startTime'] = picked;
          } else {
            _tasks[taskIndex]['endTime'] = picked;
            // Auto-fill next task start time
            if (taskIndex + 1 < 4 &&
                _tasks[taskIndex + 1]['startTime'] == null) {
              _tasks[taskIndex + 1]['startTime'] = picked;
            }
          }
        } else {
          if (isStart) {
            _startTime = picked;
          } else {
            _endTime = picked;
          }
        }
      });
    }
  }

  Future<void> _handleSubmit() async {
    if (_selectedDate == null || _startTime == null || _endTime == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Lengkapi tanggal dan jam mulai/selesai lembur utama!'),
          backgroundColor: AppColors.danger,
        ),
      );
      return;
    }

    List<String> taskLines = [];
    int taskCount = 0;

    for (int i = 0; i < 4; i++) {
      final task = _tasks[i];
      final desc = task['controller'].text.trim();

      if (desc.isNotEmpty) {
        if (task['startTime'] == null || task['endTime'] == null) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                'Tugas ke-${i + 1}: Jam mulai dan selesai wajib diisi!',
              ),
              backgroundColor: AppColors.danger,
            ),
          );
          return;
        }

        final startMin = task['startTime'].hour * 60 + task['startTime'].minute;
        final endMin = task['endTime'].hour * 60 + task['endTime'].minute;
        int diff = endMin - startMin;
        if (diff < 0) diff += 24 * 60;

        if (diff > 4 * 60) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Tugas ke-${i + 1} melebihi batas durasi 4 jam!'),
              backgroundColor: AppColors.danger,
            ),
          );
          return;
        }

        taskCount++;
        final st = _formatTimeOnly24h(task['startTime']);
        final et = _formatTimeOnly24h(task['endTime']);
        taskLines.add('$taskCount. [$st - $et] $desc');
      }
    }

    if (taskCount == 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Minimal isi satu pekerjaan!'),
          backgroundColor: AppColors.danger,
        ),
      );
      return;
    }

    String taskListStr = taskLines.join('\n');
    String finalDescription = taskListStr;

    final loc = _tempatController.text.trim();
    final cli = _pelangganController.text.trim();
    final ord = _nomorOrderController.text.trim();

    if (loc.isNotEmpty || cli.isNotEmpty || ord.isNotEmpty) {
      final l = loc.isEmpty ? '-' : loc;
      final c = cli.isEmpty ? '-' : cli;
      final o = ord.isEmpty ? '-' : ord;
      finalDescription =
          '[Lokasi: $l | Klien: $c | No Order: $o]\n\nPekerjaan:\n$taskListStr';
    } else {
      finalDescription = 'Pekerjaan:\n$taskListStr';
    }

    setState(() => _isSubmitting = true);

    String start =
        '${_startTime!.hour.toString().padLeft(2, '0')}:${_startTime!.minute.toString().padLeft(2, '0')}';
    String end =
        '${_endTime!.hour.toString().padLeft(2, '0')}:${_endTime!.minute.toString().padLeft(2, '0')}';
    String dateStr =
        '${_selectedDate!.year}-${_selectedDate!.month.toString().padLeft(2, '0')}-${_selectedDate!.day.toString().padLeft(2, '0')}';

    final result = await OvertimeService.submitOvertime(
      dateStr,
      start,
      end,
      finalDescription,
    );

    if (!mounted) return;
    setState(() => _isSubmitting = false);

    if (result['success'] == true) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Pengajuan lembur berhasil dikirim!',
            style: GoogleFonts.mulish(fontWeight: FontWeight.w600),
          ),
          backgroundColor: AppColors.success,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
        ),
      );
      Navigator.of(context).pop(true);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(result['message'] ?? 'Gagal mengirim pengajuan lembur'),
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
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildLabel('Tanggal Lembur'),
                  const SizedBox(height: 8),
                  _buildDateField(),
                  const SizedBox(height: 20),

                  Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            _buildLabel('Jam Mulai'),
                            const SizedBox(height: 8),
                            _buildTimeField(
                              value: _formatTime(_startTime),
                              onTap: () => _pickTime(isStart: true),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            _buildLabel('Jam Selesai'),
                            const SizedBox(height: 8),
                            _buildTimeField(
                              value: _formatTime(_endTime),
                              onTap: () => _pickTime(isStart: false),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),

                  _buildLabel('Total Durasi'),
                  const SizedBox(height: 8),
                  _buildDurationField(),
                  const SizedBox(height: 4),
                  Text(
                    'Durasi keseluruhan lembur yang diajukan.',
                    style: GoogleFonts.mulish(
                      fontSize: 12,
                      color: AppColors.textMuted,
                    ),
                  ),
                  const SizedBox(height: 20),
                  const Divider(color: AppColors.divider, thickness: 1),
                  const SizedBox(height: 20),

                  _buildLabel('Tempat Kerja Lembur'),
                  const SizedBox(height: 8),
                  _buildInputField(
                    controller: _tempatController,
                    hint: 'Masukkan tempat kerja lembur',
                    icon: Icons.location_on_outlined,
                  ),
                  const SizedBox(height: 20),

                  _buildLabel('Nama Pelanggan (Jika ada)'),
                  const SizedBox(height: 8),
                  _buildInputField(
                    controller: _pelangganController,
                    hint: 'Masukkan nama pelanggan',
                    icon: Icons.grid_view_outlined,
                  ),
                  const SizedBox(height: 20),

                  _buildLabel('Nomor Order (Jika ada)'),
                  const SizedBox(height: 8),
                  _buildInputField(
                    controller: _nomorOrderController,
                    hint: 'Masukkan nomor order',
                    icon: Icons.tag_outlined,
                  ),
                  const SizedBox(height: 20),
                  const Divider(color: AppColors.divider, thickness: 1),
                  const SizedBox(height: 20),

                  _buildLabel('Rincian Pekerjaan (Maks. 4 Jam per tugas)'),
                  const SizedBox(height: 16),
                  ...List.generate(4, (index) => _buildTaskItem(index)),
                  const SizedBox(height: 24),
                ],
              ),
            ),
          ),
          _buildBottomButtons(),
        ],
      ),
    );
  }

  Widget _buildTaskItem(int index) {
    final task = _tasks[index];
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Tugas ${index + 1}',
            style: GoogleFonts.mulish(
              fontWeight: FontWeight.bold,
              color: AppColors.primary,
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _buildTimeField(
                  value: _formatTimeOnly24h(task['startTime']),
                  onTap: () => _pickTime(isStart: true, taskIndex: index),
                ),
              ),
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 8.0),
                child: Text('-'),
              ),
              Expanded(
                child: _buildTimeField(
                  value: _formatTimeOnly24h(task['endTime']),
                  onTap: () => _pickTime(isStart: false, taskIndex: index),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          TextField(
            controller: task['controller'],
            maxLines: 2,
            style: GoogleFonts.mulish(fontSize: 14),
            decoration: InputDecoration(
              hintText: 'Deskripsi pekerjaan...',
              hintStyle: GoogleFonts.mulish(
                fontSize: 14,
                color: AppColors.textMuted,
              ),
              filled: true,
              fillColor: const Color(0xFFF9F9FF),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
                borderSide: BorderSide.none,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLabel(String text) {
    return Text(
      text,
      style: GoogleFonts.mulish(
        fontSize: 14,
        fontWeight: FontWeight.w700,
        color: AppColors.textPrimary,
      ),
    );
  }

  Widget _buildDateField() {
    final hasValue = _selectedDate != null;
    return GestureDetector(
      onTap: _pickDate,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.border),
        ),
        child: Row(
          children: [
            Icon(
              Icons.calendar_today_outlined,
              size: 20,
              color: hasValue ? AppColors.textPrimary : AppColors.textMuted,
            ),
            const SizedBox(width: 12),
            Text(
              _formatDate(_selectedDate),
              style: GoogleFonts.mulish(
                fontSize: 14,
                color: hasValue ? AppColors.textPrimary : AppColors.textMuted,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTimeField({required String value, required VoidCallback onTap}) {
    final hasValue = !value.contains('--');
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.border),
        ),
        child: Row(
          children: [
            Icon(
              Icons.access_time_outlined,
              size: 20,
              color: hasValue ? AppColors.textPrimary : AppColors.textMuted,
            ),
            const SizedBox(width: 8),
            Expanded(
              child: Text(
                value,
                style: GoogleFonts.mulish(
                  fontSize: 14,
                  color: hasValue ? AppColors.textPrimary : AppColors.textMuted,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDurationField() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: AppColors.primaryLight,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.primary.withOpacity(0.15)),
      ),
      child: Row(
        children: [
          Icon(Icons.access_time, size: 20, color: AppColors.primary),
          const SizedBox(width: 12),
          Text(
            _getDuration(),
            style: GoogleFonts.mulish(
              fontSize: 14,
              fontWeight: FontWeight.w700,
              color: AppColors.primaryDark,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInputField({
    required TextEditingController controller,
    required String hint,
    required IconData icon,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: TextField(
        controller: controller,
        style: GoogleFonts.mulish(fontSize: 14, color: AppColors.textPrimary),
        decoration: InputDecoration(
          hintText: hint,
          hintStyle: GoogleFonts.mulish(
            fontSize: 14,
            color: AppColors.textMuted,
          ),
          prefixIcon: Icon(icon, size: 20, color: AppColors.textMuted),
          border: InputBorder.none,
          enabledBorder: InputBorder.none,
          focusedBorder: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 14,
          ),
        ),
      ),
    );
  }

  Widget _buildBottomButtons() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.06),
            blurRadius: 16,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: Row(
          children: [
            Expanded(
              flex: 2,
              child: SizedBox(
                height: 52,
                child: OutlinedButton(
                  onPressed: () => Navigator.of(context).pop(),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppColors.textPrimary,
                    side: const BorderSide(color: AppColors.border, width: 1.2),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                  ),
                  child: Text(
                    'Batal',
                    style: GoogleFonts.mulish(
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              flex: 3,
              child: SizedBox(
                height: 52,
                child: ElevatedButton.icon(
                  onPressed: _isSubmitting ? null : _handleSubmit,
                  icon: _isSubmitting
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            valueColor: AlwaysStoppedAnimation(Colors.white),
                          ),
                        )
                      : const Icon(Icons.send, size: 20, color: Colors.white),
                  label: Text(
                    _isSubmitting ? 'Memproses...' : 'Submit',
                    style: GoogleFonts.mulish(
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                      color: Colors.white,
                    ),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
