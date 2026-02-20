import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function SplashScreen() {
  const router = useRouter();

  // If we want a timer before showing the Auth screen
  useEffect(() => {
    const timer = setTimeout(() => {
      // The _layout.tsx will handle the actual logic, 
      // but we can trigger a navigation to AuthScreen here if we want to skip Splash
      router.replace('/AuthScreen' as any);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient colors={['#00B4DB', '#0083B0']} style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>Swasth Saathi</Text>
        <Text style={styles.tagline}>Your AI Health Companion</Text>
      </View>
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#fff" />
        <Text style={styles.loadingText}>Initializing secure health portal...</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 10,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 15,
    fontSize: 14,
    opacity: 0.8,
  },
});
