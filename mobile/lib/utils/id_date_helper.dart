/// Indonesian date formatting helpers — no locale initialization needed.
class IdDateHelper {
  IdDateHelper._();

  static const _days = [
    'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu',
  ];

  static const _months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];

  /// e.g. "Senin, 18 Agustus 2026"
  static String formatFull(DateTime dt) {
    final day = _days[dt.weekday - 1];
    final month = _months[dt.month - 1];
    return '$day, ${dt.day} $month ${dt.year}';
  }

  /// e.g. "08:30"
  static String formatTime(DateTime dt) {
    return '${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}';
  }
}
