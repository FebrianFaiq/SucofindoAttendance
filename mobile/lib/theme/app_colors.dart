import 'package:flutter/material.dart';

/// Sucofindo design-system color palette — matches the web app exactly.
class AppColors {
  AppColors._();

  // ── Brand ──────────────────────────────────────────────────────────
  static const Color primary = Color(0xFF035EA9);
  static const Color primaryDark = Color(0xFF024A87);
  static const Color primaryLight = Color(0xFFEFF6FF);
  static const Color primarySurface = Color(0xFFE5F0F9);

  // ── Neutrals ───────────────────────────────────────────────────────
  static const Color background = Color(0xFFF9F9FF);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color border = Color(0xFFE5E7EB);
  static const Color divider = Color(0xFFF3F4F6);

  // ── Text ───────────────────────────────────────────────────────────
  static const Color textPrimary = Color(0xFF14141A);
  static const Color textSecondary = Color(0xFF6B7280);
  static const Color textMuted = Color(0xFF9CA3AF);
  static const Color textOnPrimary = Color(0xFFFFFFFF);

  // ── Semantic ───────────────────────────────────────────────────────
  static const Color success = Color(0xFF059669);
  static const Color successLight = Color(0xFFD1FAE5);
  static const Color successSurface = Color(0xFFF0FDF4);

  static const Color danger = Color(0xFFDC2626);
  static const Color dangerLight = Color(0xFFFEE2E2);
  static const Color dangerSurface = Color(0xFFFEF2F2);

  static const Color warning = Color(0xFFD97706);
  static const Color warningLight = Color(0xFFFEF3C7);

  static const Color info = Color(0xFF4338CA);
  static const Color infoLight = Color(0xFFE0E7FF);
}
