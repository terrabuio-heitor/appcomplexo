import 'package:flutter/material.dart';
import 'home_page.dart';

void main() {
  runApp(const AbyssLogApp());
}

class AbyssLogApp extends StatelessWidget {
  const AbyssLogApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AbyssLog',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        scaffoldBackgroundColor: const Color(0xFF0B1D2A), // azul profundo
        primaryColor: const Color(0xFF102F44),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFFD4AF37), // dourado
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF102F44),
          foregroundColor: Colors.white,
          elevation: 0,
        ),
        textTheme: const TextTheme(bodyMedium: TextStyle(color: Colors.white)),
      ),
      home: const HomePage(),
    );
  }
}
