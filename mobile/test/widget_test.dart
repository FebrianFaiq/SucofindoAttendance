import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/main.dart';

void main() {
  testWidgets('App should render login page', (WidgetTester tester) async {
    await tester.pumpWidget(const SucofindoApp());
    await tester.pumpAndSettle();

    // Verify that the login page heading is shown
    expect(find.text('Selamat Datang'), findsOneWidget);
    expect(find.text('Masuk'), findsOneWidget);
  });
}
