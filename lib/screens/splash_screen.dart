import 'dart:math';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'auth_screen.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  AnimationController? _rippleController;
  Animation<double>? _rippleAnimation;
  bool _isAnimating = false;
  Offset _rippleCenter = Offset.zero;

  @override
  void dispose() {
    _rippleController?.dispose();
    super.dispose();
  }

  void _onOpenDoor() {
    if (_isAnimating) return;

    final screenSize = MediaQuery.of(context).size;
    final buttonY = screenSize.height * 0.80;
    _rippleCenter = Offset(screenSize.width / 2, buttonY);

    // Calculate max radius to cover the entire screen from the button center
    final maxRadius = sqrt(
      pow(max(_rippleCenter.dx, screenSize.width - _rippleCenter.dx), 2) +
          pow(max(_rippleCenter.dy, screenSize.height - _rippleCenter.dy), 2),
    );

    _rippleController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    );

    _rippleAnimation = Tween<double>(begin: 0, end: maxRadius).animate(
      CurvedAnimation(
        parent: _rippleController!,
        curve: Curves.easeOutQuart,
      ),
    );

    setState(() => _isAnimating = true);

    _rippleController!.forward().then((_) {
      Navigator.of(context).pushReplacement(
        PageRouteBuilder(
          pageBuilder: (context, animation, secondaryAnimation) =>
              const AuthScreen(),
          transitionDuration: Duration.zero,
        ),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;

    return Scaffold(
      body: SafeArea(
        child: Stack(
          children: [
            // Main content
            SizedBox.expand(
              child: Column(
                children: [
                  SizedBox(height: screenHeight * 0.30),
                  // Vertical title "ヒトノハ"
                  _buildVerticalTitle(),
                  SizedBox(height: screenHeight * 0.02),
                  Text(
                    '詩ってまるで人だ',
                    style: GoogleFonts.notoSerif(
                      fontSize: 14,
                      color: const Color(0xFF2D2D2D).withValues(alpha: 0.6),
                      letterSpacing: 4,
                    ),
                  ),
                  const Spacer(),
                  // Open door button
                  Padding(
                    padding: EdgeInsets.symmetric(
                      horizontal: MediaQuery.of(context).size.width * 0.15,
                    ),
                    child: SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: _onOpenDoor,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFF5F5F0),
                          foregroundColor: const Color(0xFF2D2D2D),
                          elevation: 0,
                          padding: const EdgeInsets.symmetric(vertical: 20),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                          side: const BorderSide(
                            color: Color(0xFFE0E0D8),
                          ),
                        ),
                        child: Text(
                          '扉を開く',
                          style: GoogleFonts.notoSerif(
                            fontSize: 18,
                            fontWeight: FontWeight.w400,
                            letterSpacing: 8,
                          ),
                        ),
                      ),
                    ),
                  ),
                  SizedBox(height: screenHeight * 0.10),
                ],
              ),
            ),
            // Ripple overlay
            if (_isAnimating && _rippleAnimation != null)
              AnimatedBuilder(
                animation: _rippleAnimation!,
                builder: (context, child) {
                  return CustomPaint(
                    size: MediaQuery.of(context).size,
                    painter: _RipplePainter(
                      center: _rippleCenter,
                      radius: _rippleAnimation!.value,
                      color: const Color(0xFFF5F5F0),
                    ),
                  );
                },
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildVerticalTitle() {
    const chars = ['ヒ', 'ト', 'ノ', 'ハ'];
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: chars.map((char) {
        return Text(
          char,
          style: GoogleFonts.notoSerif(
            fontSize: 42,
            fontWeight: FontWeight.w300,
            height: 1.6,
            letterSpacing: 8,
            color: const Color(0xFF2D2D2D),
          ),
        );
      }).toList(),
    );
  }
}

class _RipplePainter extends CustomPainter {
  final Offset center;
  final double radius;
  final Color color;

  _RipplePainter({
    required this.center,
    required this.radius,
    required this.color,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.fill;
    canvas.drawCircle(center, radius, paint);
  }

  @override
  bool shouldRepaint(_RipplePainter oldDelegate) {
    return oldDelegate.radius != radius;
  }
}
