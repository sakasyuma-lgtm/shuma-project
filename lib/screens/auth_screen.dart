import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../providers/auth_provider.dart';

class AuthScreen extends ConsumerStatefulWidget {
  const AuthScreen({super.key});

  @override
  ConsumerState<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends ConsumerState<AuthScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _nameController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  bool _isLoading = false;
  String? _errorMessage;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _nameController.dispose();
    super.dispose();
  }

  Future<void> _handleEmailAuth(bool isLogin) async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final authService = ref.read(authServiceProvider);
      if (isLogin) {
        await authService.signInWithEmail(
          _emailController.text.trim(),
          _passwordController.text,
        );
      } else {
        await authService.signUpWithEmail(
          _emailController.text.trim(),
          _passwordController.text,
          _nameController.text.trim(),
        );
      }
    } catch (e) {
      setState(() => _errorMessage = _parseAuthError(e.toString()));
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _handleGoogleSignIn() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final authService = ref.read(authServiceProvider);
      await authService.signInWithGoogle();
    } catch (e) {
      setState(() => _errorMessage = _parseAuthError(e.toString()));
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  String _parseAuthError(String error) {
    if (error.contains('user-not-found')) return 'アカウントが見つかりません';
    if (error.contains('wrong-password')) return 'パスワードが正しくありません';
    if (error.contains('email-already-in-use')) return 'このメールアドレスは既に使用されています';
    if (error.contains('weak-password')) return 'パスワードが短すぎます';
    if (error.contains('invalid-email')) return 'メールアドレスの形式が正しくありません';
    if (error.contains('network-request-failed')) return 'ネットワークエラーが発生しました';
    return '認証に失敗しました。もう一度お試しください';
  }

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    final screenWidth = MediaQuery.of(context).size.width;
    final horizontalPadding = screenWidth * 0.08;

    return Scaffold(
      body: SafeArea(
        child: DefaultTabController(
          length: 2,
          child: Column(
            children: [
              SizedBox(height: screenHeight * 0.06),
              // Title
              Text(
                'ヒトノハ',
                style: GoogleFonts.notoSerif(
                  fontSize: 28,
                  fontWeight: FontWeight.w300,
                  letterSpacing: 8,
                  color: const Color(0xFF2D2D2D),
                ),
              ),
              SizedBox(height: screenHeight * 0.04),
              // Tabs
              Padding(
                padding: EdgeInsets.symmetric(horizontal: horizontalPadding),
                child: TabBar(
                  labelStyle: GoogleFonts.notoSerif(
                    fontSize: 15,
                    fontWeight: FontWeight.w500,
                  ),
                  unselectedLabelStyle: GoogleFonts.notoSerif(
                    fontSize: 15,
                    fontWeight: FontWeight.w400,
                  ),
                  labelColor: const Color(0xFF2D2D2D),
                  unselectedLabelColor:
                      const Color(0xFF2D2D2D).withValues(alpha: 0.4),
                  indicatorColor: const Color(0xFF2D2D2D),
                  indicatorWeight: 1.5,
                  dividerColor: const Color(0xFFE0E0D8),
                  tabs: const [
                    Tab(text: 'ログイン'),
                    Tab(text: '新規登録'),
                  ],
                ),
              ),
              SizedBox(height: screenHeight * 0.04),
              // Tab content
              Expanded(
                child: TabBarView(
                  children: [
                    _buildLoginForm(horizontalPadding),
                    _buildRegisterForm(horizontalPadding),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLoginForm(double horizontalPadding) {
    return SingleChildScrollView(
      padding: EdgeInsets.symmetric(horizontal: horizontalPadding),
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _buildEmailField(),
            const SizedBox(height: 16),
            _buildPasswordField(),
            if (_errorMessage != null) ...[
              const SizedBox(height: 12),
              _buildErrorMessage(),
            ],
            const SizedBox(height: 24),
            _buildSubmitButton('ログイン', () => _handleEmailAuth(true)),
            const SizedBox(height: 24),
            _buildDivider(),
            const SizedBox(height: 24),
            _buildGoogleButton(),
          ],
        ),
      ),
    );
  }

  Widget _buildRegisterForm(double horizontalPadding) {
    return SingleChildScrollView(
      padding: EdgeInsets.symmetric(horizontal: horizontalPadding),
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _buildNameField(),
            const SizedBox(height: 16),
            _buildEmailField(),
            const SizedBox(height: 16),
            _buildPasswordField(),
            if (_errorMessage != null) ...[
              const SizedBox(height: 12),
              _buildErrorMessage(),
            ],
            const SizedBox(height: 24),
            _buildSubmitButton('新規登録', () => _handleEmailAuth(false)),
            const SizedBox(height: 24),
            _buildDivider(),
            const SizedBox(height: 24),
            _buildGoogleButton(),
          ],
        ),
      ),
    );
  }

  Widget _buildNameField() {
    return TextFormField(
      controller: _nameController,
      style: GoogleFonts.notoSerif(fontSize: 15),
      decoration: InputDecoration(
        hintText: 'ペンネーム',
        hintStyle: GoogleFonts.notoSerif(
          color: const Color(0xFF2D2D2D).withValues(alpha: 0.3),
        ),
      ),
      validator: (value) {
        if (value == null || value.trim().isEmpty) return 'ペンネームを入力してください';
        return null;
      },
    );
  }

  Widget _buildEmailField() {
    return TextFormField(
      controller: _emailController,
      keyboardType: TextInputType.emailAddress,
      style: GoogleFonts.notoSerif(fontSize: 15),
      decoration: InputDecoration(
        hintText: 'メールアドレス',
        hintStyle: GoogleFonts.notoSerif(
          color: const Color(0xFF2D2D2D).withValues(alpha: 0.3),
        ),
      ),
      validator: (value) {
        if (value == null || value.trim().isEmpty) return 'メールアドレスを入力してください';
        if (!value.contains('@')) return '正しいメールアドレスを入力してください';
        return null;
      },
    );
  }

  Widget _buildPasswordField() {
    return TextFormField(
      controller: _passwordController,
      obscureText: true,
      style: GoogleFonts.notoSerif(fontSize: 15),
      decoration: InputDecoration(
        hintText: 'パスワード',
        hintStyle: GoogleFonts.notoSerif(
          color: const Color(0xFF2D2D2D).withValues(alpha: 0.3),
        ),
      ),
      validator: (value) {
        if (value == null || value.isEmpty) return 'パスワードを入力してください';
        if (value.length < 6) return 'パスワードは6文字以上にしてください';
        return null;
      },
    );
  }

  Widget _buildErrorMessage() {
    return Text(
      _errorMessage!,
      style: GoogleFonts.notoSerif(
        fontSize: 13,
        color: Colors.red.shade700,
      ),
      textAlign: TextAlign.center,
    );
  }

  Widget _buildSubmitButton(String label, VoidCallback onPressed) {
    return ElevatedButton(
      onPressed: _isLoading ? null : onPressed,
      child: _isLoading
          ? const SizedBox(
              height: 20,
              width: 20,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                color: Color(0xFFF5F5F0),
              ),
            )
          : Text(label),
    );
  }

  Widget _buildDivider() {
    return Row(
      children: [
        const Expanded(child: Divider(color: Color(0xFFE0E0D8))),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Text(
            'または',
            style: GoogleFonts.notoSerif(
              fontSize: 13,
              color: const Color(0xFF2D2D2D).withValues(alpha: 0.4),
            ),
          ),
        ),
        const Expanded(child: Divider(color: Color(0xFFE0E0D8))),
      ],
    );
  }

  Widget _buildGoogleButton() {
    return OutlinedButton(
      onPressed: _isLoading ? null : _handleGoogleSignIn,
      style: OutlinedButton.styleFrom(
        padding: const EdgeInsets.symmetric(vertical: 16),
        side: const BorderSide(color: Color(0xFFE0E0D8)),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.g_mobiledata, size: 24, color: Color(0xFF2D2D2D)),
          const SizedBox(width: 8),
          Text(
            'Googleでログイン',
            style: GoogleFonts.notoSerif(
              fontSize: 15,
              color: const Color(0xFF2D2D2D),
            ),
          ),
        ],
      ),
    );
  }
}
