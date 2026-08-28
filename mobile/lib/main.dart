import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'theme/app_theme.dart';
import 'pages/login_page.dart';
import 'pages/main_page.dart';
import 'pages/change_password_page.dart';
import 'services/auth_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
    ),
  );

  // Check auto-login
  Widget initialPage = const LoginPage();
  final token = await AuthService.getToken();
  if (token != null) {
    final user = await AuthService.getUser();
    if (user != null && user['must_change_password'] == true) {
      initialPage = const ChangePasswordPage();
    } else {
      initialPage = const MainPage();
    }
  }

  runApp(SucofindoApp(initialPage: initialPage));
}

class SucofindoApp extends StatelessWidget {
  final Widget initialPage;
  const SucofindoApp({super.key, required this.initialPage});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Sucofindo Mobile',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light,
      home: initialPage,
    );
  }
}
