import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../hooks/useAuthStore';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const API_URL = 'http://localhost:5000/api'; // Update with your actual IP for physical devices

const SignInScreen = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore(state => state.setAuth);

  const handleSendOtp = async () => {
    if (phone.length < 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid 10-digit phone number');
      return;
    }
    setLoading(true);
    // Works offline — no backend needed for demo
    setIsOtpSent(true);
    Alert.alert('OTP Sent', 'Use 123 for this demo');
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (otp !== '123') {
      Alert.alert('Invalid OTP', 'Please enter the correct OTP (123)');
      return;
    }
    setLoading(true);
    // Offline mock auth — works without backend
    const mockUser = { phone, name: name || 'User', role: 'patient' };
    const mockToken = 'demo-token-' + Date.now();
    await setAuth(mockToken, mockUser);
    setLoading(false);
    router.replace('/HomeScreen' as any);
  };

  return (
    <LinearGradient colors={['#0083B0', '#00B4DB']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.content}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Ionicons name="shield-checkmark" size={60} color="#0083B0" />
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Secure login via OTP</Text>

          {!isOtpSent ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Full Name (for first time)"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={10}
              />
              <TouchableOpacity style={styles.button} onPress={handleSendOtp} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Get OTP</Text>}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.infoText}>Enter the 6-digit code sent to {phone}</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter 3-digit OTP"
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={3}
              />
              <TouchableOpacity style={styles.button} onPress={handleVerifyOtp} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verify & Login</Text>}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsOtpSent(false)}>
                <Text style={styles.backBtn}>Change Phone Number</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  card: { backgroundColor: '#fff', borderRadius: 25, padding: 30, width: '100%', maxWidth: 400, alignItems: 'center', elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20 },
  iconContainer: { marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2D3436' },
  subtitle: { fontSize: 16, color: '#636E72', marginBottom: 30 },
  input: { width: '100%', backgroundColor: '#F0F2F5', borderRadius: 12, padding: 15, marginBottom: 15, fontSize: 16 },
  button: { width: '100%', backgroundColor: '#0083B0', borderRadius: 12, padding: 18, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  infoText: { fontSize: 14, color: '#636E72', marginBottom: 20, textAlign: 'center' },
  backBtn: { marginTop: 20, color: '#0083B0', fontWeight: 'bold' },
});

export default SignInScreen;

