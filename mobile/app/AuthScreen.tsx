import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const AuthScreen = () => {
  const router = useRouter();
  return (
    <LinearGradient colors={['#0083B0', '#00B4DB']} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Ionicons name="medkit" size={80} color="#fff" />
          <Text style={styles.title}>Swasth Saathi</Text>
          <Text style={styles.subtitle}>Your AI Healthcare Companion</Text>
          <Text style={styles.tagline}>Accessible • Affordable • In Your Language</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push('/SignInScreen' as any)}>
            <Ionicons name="log-in-outline" size={22} color="#0083B0" />
            <Text style={styles.primaryText}>Sign In / Sign Up</Text>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>By continuing, you agree to our Terms & Privacy Policy</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'space-between', paddingVertical: 80, paddingHorizontal: 30 },
  logoContainer: { alignItems: 'center', marginTop: 60 },
  title: { fontSize: 40, fontWeight: 'bold', color: '#fff', marginTop: 20, letterSpacing: 1 },
  subtitle: { fontSize: 18, color: 'rgba(255,255,255,0.9)', marginTop: 10 },
  tagline: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 8 },
  buttonContainer: { alignItems: 'center' },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingVertical: 18, paddingHorizontal: 50, borderRadius: 30, elevation: 5 },
  primaryText: { color: '#0083B0', fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  disclaimer: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 20, textAlign: 'center' },
});

export default AuthScreen;
