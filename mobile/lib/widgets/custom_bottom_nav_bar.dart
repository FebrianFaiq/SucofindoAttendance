import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_colors.dart';
import '../pages/dashboard_page.dart';
import '../pages/overtime_page.dart';
import '../pages/profile_page.dart';

class CustomBottomNavBar extends StatelessWidget {
  final int selectedIndex;

  const CustomBottomNavBar({
    super.key,
    required this.selectedIndex,
  });

  @override
  Widget build(BuildContext context) {
    return BottomAppBar(
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
              context: context,
              icon: Icons.access_time,
              label: 'Lembur',
              isActive: selectedIndex == 0,
              targetPage: const OvertimePage(),
              currentIndex: 0,
            ),
            // Absensi (Center) - We just render the label since FAB is in Scaffold
            SizedBox(
              width: 80,
              child: GestureDetector(
                onTap: () {
                  if (selectedIndex != 1) {
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(builder: (_) => const DashboardPage()),
                    );
                  }
                },
                behavior: HitTestBehavior.opaque,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    if (selectedIndex == 1) ...[
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
                      const SizedBox(height: 9),
                    ],
                    Text(
                      'Absensi',
                      style: GoogleFonts.mulish(
                        fontSize: 13,
                        fontWeight: selectedIndex == 1 ? FontWeight.w700 : FontWeight.w600,
                        color: selectedIndex == 1 ? AppColors.primaryDark : AppColors.textSecondary,
                      ),
                    ),
                    const SizedBox(
                      height: 13,
                    ), // total 2+5+6 = 13 for alignment
                  ],
                ),
              ),
            ),
            // Profil
            _buildBottomNavItem(
              context: context,
              icon: Icons.person_outline,
              label: 'Profil',
              isActive: selectedIndex == 2,
              targetPage: const ProfilePage(),
              currentIndex: 2,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBottomNavItem({
    required BuildContext context,
    required IconData icon,
    required String label,
    required bool isActive,
    required Widget targetPage,
    required int currentIndex,
  }) {
    return GestureDetector(
      onTap: () {
        if (selectedIndex != currentIndex) {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (_) => targetPage),
          );
        }
      },
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
            const SizedBox(
              height: 13,
            ), // padding at bottom to align with center item
          ],
        ),
      ),
    );
  }
}
