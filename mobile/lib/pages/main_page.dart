import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../widgets/custom_app_bar.dart';
import '../widgets/custom_bottom_nav_bar.dart';
import 'dashboard_page.dart';
import 'overtime_page.dart';
import 'profile_page.dart';

class MainPage extends StatefulWidget {
  final int initialIndex;
  
  const MainPage({
    super.key,
    this.initialIndex = 1, // Default to Absensi
  });

  @override
  State<MainPage> createState() => _MainPageState();
}

class _MainPageState extends State<MainPage> {
  late int _currentIndex;
  final GlobalKey<DashboardPageState> _dashboardKey = GlobalKey<DashboardPageState>();

  late List<Widget> _pages;

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialIndex;
    _pages = [
      const OvertimePage(),
      DashboardPage(key: _dashboardKey),
      const ProfilePage(),
    ];
  }

  void _onItemTapped(int index) {
    if (index == _currentIndex) return;
    
    // Optional: if switching to dashboard, we might want to refresh data
    if (index == 1) {
      _dashboardKey.currentState?.loadDashboardData();
    }
    
    setState(() {
      _currentIndex = index;
    });
  }

  void _onFabTapped() {
    if (_currentIndex == 1) {
      // If already on Dashboard, trigger Clock In/Out action
      _dashboardKey.currentState?.handleAction();
    } else {
      // Otherwise switch to Dashboard
      _onItemTapped(1);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF9F9FF),
      appBar: const CustomAppBar(),
      body: IndexedStack(
        index: _currentIndex,
        children: _pages,
      ),
      floatingActionButton: AnimatedContainer(
        duration: const Duration(milliseconds: 250),
        curve: Curves.easeOut,
        transform: Matrix4.translationValues(0, _currentIndex == 1 ? -12.0 : 0.0, 0),
        child: SizedBox(
          width: 64,
          height: 64,
          child: FloatingActionButton(
            onPressed: _onFabTapped,
            backgroundColor: _currentIndex == 1 ? AppColors.primaryDark : AppColors.textSecondary,
            elevation: _currentIndex == 1 ? 6 : 4,
            shape: const CircleBorder(),
            child: const Icon(Icons.fingerprint, color: Colors.white, size: 34),
          ),
        ),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      bottomNavigationBar: CustomBottomNavBar(
        selectedIndex: _currentIndex,
        onItemTapped: _onItemTapped,
      ),
    );
  }
}
