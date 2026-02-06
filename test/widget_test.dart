import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:hitonoha/main.dart';

void main() {
  testWidgets('App launches with splash screen', (WidgetTester tester) async {
    await tester.pumpWidget(const ProviderScope(child: HitonohaApp()));

    expect(find.text('ヒ'), findsOneWidget);
    expect(find.text('扉を開く'), findsOneWidget);
  });
}
