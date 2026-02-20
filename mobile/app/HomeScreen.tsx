import { Feather, FontAwesome5, Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../hooks/useAuthStore';
import { useAppStore } from '../hooks/useAppStore';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

const SIDEBAR_WIDTH = 260;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const menuItems = [
  { label: 'Home', icon: <Feather name="home" size={22} color="#fff" /> },
  { label: 'Check Symptoms', icon: <Ionicons name="medkit" size={22} color="#fff" /> },
  { label: 'My Records', icon: <Feather name="folder" size={22} color="#fff" /> },
  { label: 'My Health', icon: <FontAwesome5 name="chart-bar" size={20} color="#fff" /> },
  { label: 'Medicines', icon: <FontAwesome5 name="pills" size={20} color="#fff" /> },
  { label: 'Nutrition', icon: <MaterialCommunityIcons name="food-apple" size={22} color="#fff" /> },
  { label: 'Mental Health', icon: <MaterialCommunityIcons name="head-heart" size={22} color="#fff" /> },
  { label: 'Govt Schemes', icon: <MaterialIcons name="account-balance" size={22} color="#fff" /> },
  { label: 'Nearby Doctors', icon: <FontAwesome5 name="user-md" size={20} color="#fff" /> },
  { label: 'Community', icon: <Ionicons name="people" size={22} color="#fff" /> },
  { label: 'Emergency', icon: <Ionicons name="warning" size={22} color="#fff" /> },
  { label: 'Feedback', icon: <Ionicons name="chatbox-ellipses" size={22} color="#fff" /> },
  { label: 'Settings', icon: <Ionicons name="settings-outline" size={22} color="#fff" /> },
  { label: 'Profile', icon: <Feather name="user" size={22} color="#fff" /> },
];

const dailyTips = [
  "💧 Stay hydrated! Drink at least 3 litres water daily for kidney health.",
  "🧘 5 minutes of deep breathing daily reduces cortisol by 23%.",
  "🥗 Include seasonal Indian vegetables in every meal for immunity.",
  "🚶 Walking 30 mins/day cuts heart disease risk by 35%.",
  "😴 7-8 hours of sleep is essential for cellular repair.",
];

const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
];


const HomeScreen = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selected, setSelected] = useState('Home');
  const [showLangPicker, setShowLangPicker] = useState(false);
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const navigation = useNavigation();
  const router = useRouter();

  // Stores
  const { user } = useAuthStore();
  const {
    darkMode, setDarkMode, language, setLanguage,
    profile, medicines, waterGlasses, moodEntries, stepEntries, init
  } = useAppStore();

  useEffect(() => { init(); }, []);

  // Dynamic Data Calculation
  const today = new Date().toISOString().split('T')[0];
  const todayMeds = medicines.filter(m => m.date === today);
  const medScore = todayMeds.length > 0 ? (todayMeds.filter(m => m.taken).length / todayMeds.length) * 25 : 25;
  const waterScore = Math.min(25, (waterGlasses / 8) * 25);
  const todayMood = moodEntries.find(m => m.date === today);
  const moodScore = todayMood ? ((4 - todayMood.mood) / 4) * 25 : 0;
  const todaySteps = stepEntries.find(e => e.date === today)?.steps || 0;
  const stepScore = Math.min(25, (todaySteps / 8000) * 25);
  const healthScore = Math.round(medScore + waterScore + moodScore + stepScore);

  const tipIndex = new Date().getDate() % dailyTips.length;
  const bg = darkMode ? '#1a1a2e' : '#F8F9FA';
  const cardBg = darkMode ? '#16213e' : '#fff';
  const textColor = darkMode ? '#e0e0e0' : '#2D3436';
  const subColor = darkMode ? '#999' : '#636E72';
  const displayLang = languages.find(l => l.code === language)?.label || 'English';

  const toggleSidebar = () => {
    const toValue = sidebarOpen ? -SIDEBAR_WIDTH : 0;
    setSidebarOpen(!sidebarOpen);
    Animated.timing(slideAnim, { toValue, duration: 250, useNativeDriver: false }).start();
  };

  const routeMap: any = {
    'Home': 'HomeScreen', 'Check Symptoms': 'CheckSymptomsScreen',
    'My Records': 'MyRecordsScreen', 'My Health': 'MyHealthScreen',
    'Medicines': 'MedicinesScreen', 'Govt Schemes': 'GovtSchemesScreen',
    'Nutrition': 'NutritionScreen', 'Mental Health': 'MentalHealthScreen',
    'Nearby Doctors': 'NearbyDoctorsScreen',
    'Community': 'CommunityScreen', 'Emergency': 'EmergencyScreen',
    'Feedback': 'FeedbackScreen', 'Settings': 'SettingsScreen', 'Profile': 'ProfileScreen',
  };

  const navigateTo = (label: string) => {
    setSelected(label);
    setSidebarOpen(false);
    Animated.timing(slideAnim, { toValue: -SIDEBAR_WIDTH, duration: 250, useNativeDriver: false }).start();
    if (routeMap[label]) navigation.navigate(routeMap[label] as never);
  };

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      {/* Sidebar */}
      <Animated.View style={[styles.sidebar, { left: slideAnim }]}>
        <LinearGradient colors={['#0083B0', '#00B4DB']} style={styles.sidebarGradient}>
          <View style={styles.sidebarHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{(profile.name || user?.name || 'U').charAt(0).toUpperCase()}</Text>
            </View>
            <Text style={styles.sidebarName}>{profile.name || user?.name || 'User'}</Text>
            <Text style={styles.sidebarPhone}>{profile.phone || user?.phone || ''}</Text>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {menuItems.map(item => (
              <TouchableOpacity
                key={item.label}
                style={[styles.menuItem, selected === item.label && styles.menuItemSelected]}
                onPress={() => navigateTo(item.label)}
              >
                <View style={styles.icon}>{item.icon}</View>
                <Text style={styles.menuText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={async () => {
                await useAuthStore.getState().logout();
                router.replace('/AuthScreen' as any);
              }}
            >
              <View style={styles.icon}><Feather name="log-out" size={22} color="#FF6B6B" /></View>
              <Text style={[styles.menuText, { color: '#FF6B6B' }]}>Logout</Text>
            </TouchableOpacity>
          </ScrollView>
        </LinearGradient>
      </Animated.View>

      {/* Main Content */}
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <TouchableOpacity onPress={toggleSidebar}>
              <Ionicons name="menu" size={28} color={textColor} />
            </TouchableOpacity>
            <Text style={[styles.appName, { color: textColor }]}>Swasth Saathi</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => setShowLangPicker(!showLangPicker)} style={styles.langBtn}>
                <Ionicons name="globe-outline" size={20} color={textColor} />
                <Text style={{ color: textColor, fontSize: 12, marginLeft: 3 }}>{displayLang.substring(0, 2)}</Text>
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                <Ionicons name={darkMode ? 'moon' : 'sunny'} size={18} color={textColor} />
                <Switch value={darkMode} onValueChange={setDarkMode} trackColor={{ true: '#00B4DB', false: '#ccc' }} style={{ marginLeft: 5, transform: [{ scale: 0.8 }] }} />
              </View>
            </View>
          </View>

          {/* Language Picker */}
          {showLangPicker && (
            <View style={[styles.langPicker, { backgroundColor: cardBg }]}>
              {languages.map(lang => (
                <TouchableOpacity key={lang.code} style={styles.langOption} onPress={() => { setLanguage(lang.code); setShowLangPicker(false); }}>
                  <Text style={[styles.langOptionText, { color: textColor }, language === lang.code && { color: '#00B4DB', fontWeight: 'bold' }]}>{lang.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Mission Banner */}
          <LinearGradient colors={['#0083B0', '#00B4DB']} style={styles.missionBanner}>
            <Text style={styles.missionTitle}>🏥 Swasth Bharat, Swasth Saathi</Text>
            <Text style={styles.missionSubtitle}>AI-powered preventive healthcare for every Indian citizen. Accessible, affordable, and in your language.</Text>
          </LinearGradient>

          {/* Health Score Card */}
          <LinearGradient colors={['#6C63FF', '#5B54E8']} style={styles.scoreCard}>
            <View style={styles.scoreLeft}>
              <Text style={styles.scoreLabel}>Your Health Score</Text>
              <Text style={styles.scoreValue}>{healthScore}<Text style={styles.scoreMax}>/100</Text></Text>
              <Text style={styles.scoreHint}>{healthScore > 75 ? 'Excellent! Keep it up 💪' : healthScore > 50 ? 'Good, but improve! 📈' : 'Needs Attention ⚠️'}</Text>
            </View>
            <View style={styles.scoreRight}>
              <Ionicons name="checkmark-circle" size={50} color="#fff" />
            </View>
          </LinearGradient>

          {/* Daily Health Tip */}
          <View style={[styles.tipCard, { backgroundColor: cardBg }]}>
            <View style={styles.tipHeader}>
              <Ionicons name="bulb-outline" size={24} color="#FFA502" />
              <Text style={[styles.tipTitle, { color: textColor }]}>Daily Health Tip</Text>
            </View>
            <Text style={[styles.tipContent, { color: subColor }]}>{dailyTips[tipIndex]}</Text>
          </View>

          {/* Epidemic Alert */}
          <View style={[styles.alertCard, { backgroundColor: darkMode ? '#2d1f1f' : '#FFF5F5' }]}>
            <View style={styles.alertIndicator} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.alertTitle, { color: '#FF4757' }]}>🚨 Epidemic Alert: Dengue</Text>
              <Text style={[styles.alertSubtitle, { color: subColor }]}>High risk in your area. Use mosquito nets, wear full sleeves.</Text>
            </View>
          </View>

          {/* Quick Actions */}
          <Text style={[styles.sectionTitle, { color: textColor }]}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            {[
              { label: 'Check Symptoms', icon: 'chatbubble-ellipses-outline', color: '#00B4DB', route: 'CheckSymptomsScreen' },
              { label: 'Nearby Doctors', icon: 'medkit-outline', color: '#10AC84', route: 'NearbyDoctorsScreen' },
              { label: 'Upload Report', icon: 'cloud-upload-outline', color: '#6C63FF', route: 'MyRecordsScreen' },
              { label: 'Nutrition Plan', icon: 'nutrition-outline', color: '#FFA502', route: 'NutritionScreen' },
              { label: 'Emergency SOS', icon: 'warning-outline', color: '#FF4757', route: 'EmergencyScreen' },
              { label: 'Mental Health', icon: 'happy-outline', color: '#A29BFE', route: 'MentalHealthScreen' },
            ].map((action, idx) => (
              <TouchableOpacity key={idx} style={[styles.actionItem, { backgroundColor: cardBg }]} onPress={() => navigation.navigate(action.route as never)}>
                <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                  <Ionicons name={action.icon as any} size={28} color={action.color} />
                </View>
                <Text style={[styles.actionLabel, { color: textColor }]}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Vaccination Reminder */}
          <View style={[styles.reminderCard, { backgroundColor: cardBg }]}>
            <MaterialCommunityIcons name="needle" size={24} color="#10AC84" />
            <View style={{ flex: 1, marginLeft: 15 }}>
              <Text style={[styles.reminderTitle, { color: textColor }]}>Vaccination Reminder</Text>
              <Text style={{ color: subColor, fontSize: 13 }}>Flu shot due in 2 weeks. Stay protected!</Text>
            </View>
            <TouchableOpacity><Text style={{ color: '#00B4DB', fontWeight: 'bold' }}>Set</Text></TouchableOpacity>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Floating Emergency SOS */}
        <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('EmergencyScreen' as never)}>
          <Ionicons name="call" size={28} color="#fff" />
          <Text style={styles.fabText}>SOS</Text>
        </TouchableOpacity>
      </SafeAreaView>

      {/* Overlay */}
      {sidebarOpen && (
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={toggleSidebar} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  sidebar: { position: 'absolute', top: 0, bottom: 0, width: SIDEBAR_WIDTH, zIndex: 100 },
  sidebarGradient: { flex: 1, paddingTop: 60 },
  sidebarHeader: { alignItems: 'center', paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.2)', marginBottom: 10 },
  avatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  avatarText: { fontSize: 30, color: '#fff', fontWeight: 'bold' },
  sidebarName: { fontSize: 18, color: '#fff', fontWeight: 'bold' },
  sidebarPhone: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 3 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 25 },
  menuItemSelected: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, marginHorizontal: 10 },
  icon: { width: 35 },
  menuText: { fontSize: 16, color: '#fff', fontWeight: '500' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 50 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
  appName: { fontSize: 22, fontWeight: 'bold' },
  langBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: '#ccc' },
  langPicker: { marginHorizontal: 20, borderRadius: 12, padding: 10, elevation: 5 },
  langOption: { paddingVertical: 10, paddingHorizontal: 15 },
  langOptionText: { fontSize: 16 },
  missionBanner: { marginHorizontal: 20, borderRadius: 20, padding: 25, marginBottom: 20 },
  missionTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  missionSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 20 },
  scoreCard: { marginHorizontal: 20, borderRadius: 20, padding: 25, flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  scoreLeft: { flex: 1 },
  scoreLabel: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  scoreValue: { fontSize: 48, fontWeight: 'bold', color: '#fff' },
  scoreMax: { fontSize: 20, fontWeight: 'normal' },
  scoreHint: { fontSize: 14, color: 'rgba(255,255,255,0.85)', marginTop: 5 },
  scoreRight: { marginLeft: 20 },
  tipCard: { marginHorizontal: 20, borderRadius: 16, padding: 20, marginBottom: 15, elevation: 2 },
  tipHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  tipTitle: { fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
  tipContent: { fontSize: 14, lineHeight: 22 },
  alertCard: { marginHorizontal: 20, borderRadius: 16, padding: 15, flexDirection: 'row', alignItems: 'center', marginBottom: 20, elevation: 1 },
  alertIndicator: { width: 4, height: 40, backgroundColor: '#FF4757', borderRadius: 2, marginRight: 15 },
  alertTitle: { fontSize: 15, fontWeight: 'bold' },
  alertSubtitle: { fontSize: 13, marginTop: 3 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginHorizontal: 20, marginBottom: 15 },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 15, marginBottom: 20 },
  actionItem: { width: (SCREEN_WIDTH - 60) / 3, alignItems: 'center', padding: 15, borderRadius: 16, margin: 5, elevation: 2 },
  actionIcon: { width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  actionLabel: { fontSize: 12, textAlign: 'center', fontWeight: '600' },
  reminderCard: { marginHorizontal: 20, borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center', elevation: 2, marginBottom: 15 },
  reminderTitle: { fontSize: 15, fontWeight: 'bold' },
  fab: { position: 'absolute', bottom: 25, right: 25, backgroundColor: '#FF4757', width: 65, height: 65, borderRadius: 33, justifyContent: 'center', alignItems: 'center', elevation: 10 },
  fabText: { color: '#fff', fontSize: 11, fontWeight: 'bold', marginTop: 2 },
});

export default HomeScreen;
