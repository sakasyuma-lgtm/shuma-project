import 'package:flutter_riverpod/flutter_riverpod.dart';

final authServiceProvider = Provider<AuthService>((ref) {
  return AuthService();
});

class AuthService {
  Future<void> signInWithEmail(String email, String password) async {
    // TODO: Integrate with Firebase Auth
    // final credential = await FirebaseAuth.instance.signInWithEmailAndPassword(
    //   email: email,
    //   password: password,
    // );
    await Future.delayed(const Duration(seconds: 1));
    throw Exception('Firebase未設定: firebase_options.dartを生成してください');
  }

  Future<void> signUpWithEmail(
      String email, String password, String name) async {
    // TODO: Integrate with Firebase Auth
    // final credential = await FirebaseAuth.instance.createUserWithEmailAndPassword(
    //   email: email,
    //   password: password,
    // );
    // await credential.user?.updateDisplayName(name);
    await Future.delayed(const Duration(seconds: 1));
    throw Exception('Firebase未設定: firebase_options.dartを生成してください');
  }

  Future<void> signInWithGoogle() async {
    // TODO: Integrate with Google Sign-In + Firebase Auth
    // final googleUser = await GoogleSignIn().signIn();
    // final googleAuth = await googleUser?.authentication;
    // final credential = GoogleAuthProvider.credential(
    //   accessToken: googleAuth?.accessToken,
    //   idToken: googleAuth?.idToken,
    // );
    // await FirebaseAuth.instance.signInWithCredential(credential);
    await Future.delayed(const Duration(seconds: 1));
    throw Exception('Firebase未設定: firebase_options.dartを生成してください');
  }
}
