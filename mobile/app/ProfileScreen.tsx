import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppStore } from '../hooks/useAppStore';
import { useAuthStore } from '../hooks/useAuthStore';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function ProfileScreen() {
  const { profile, bookings, init } = useAppStore();
  const { user, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => { init(); }, []);

  const displayName = profile.name || user?.name || 'User Name';
  const displayPhone = profile.phone || user?.phone || '+91';
  const displayEmail = profile.email || 'No email added';
  const initials = displayName.charAt(0).toUpperCase();

  const upcomingBookings = bookings.filter(b => b.status === "upcoming").sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleLogout = async () => {
    await logout();
    router.replace('/AuthScreen' as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient colors={['#0083B0', '#00B4DB']} style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{initials}</Text>
            <TouchableOpacity style={styles.editAvatarBtn} onPress={() => router.push('/SettingsScreen' as any)}>
              <Ionicons name="pencil" size={16} color="#0083B0" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{displayName}</Text>
          <Text style={styles.userPhone}>{displayPhone}</Text>
          <Text style={styles.userEmail}>{displayEmail}</Text>
        </LinearGradient>

        {/* Medical Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Medical Snapshot</Text>
            <TouchableOpacity onPress={() => router.push('/SettingsScreen' as any)}>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="blood-bag" size={24} color="#FF4757" />
              <Text style={styles.statValue}>{profile.bloodGroup || '--'}</Text>
              <Text style={styles.statLabel}>Blood Group</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="human-male-height" size={24} color="#10AC84" />
              <Text style={styles.statValue}>{profile.height || '--'} cm</Text>
              <Text style={styles.statLabel}>Height</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="weight" size={24} color="#FFA502" />
              <Text style={styles.statValue}>{profile.weight || '--'} kg</Text>
              <Text style={styles.statLabel}>Weight</Text>
            </View>
          </View>
        </View>

        {/* My Appointments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Appointments</Text>
          {upcomingBookings.length > 0 ? (
            upcomingBookings.map(item => {
              const d = new Date(item.date);
              return (
                <View key={item.id} style={styles.apptCard}>
                  <View style={styles.apptDateBox}>
                    <Text style={styles.apptDateDay}>{d.getDate()}</Text>
                    <Text style={styles.apptDateMonth}>{monthNames[d.getMonth()]}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 15 }}>
                    <Text style={styles.apptDoctor}>{item.doctorName}</Text>
                    <Text style={styles.apptSpecialty}>{item.specialty}</Text>
                    <Text style={styles.apptHospital}>{item.hospital}</Text>
                  </View>
                  <View style={styles.apptStatus}>
                    <Text style={styles.apptStatusText}>Confirmed</Text>
                  </View>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyAppt}>
              <Ionicons name="calendar-outline" size={30} color="#ccc" style={{ marginBottom: 5 }} />
              <Text style={styles.emptyApptText}>No upcoming appointments</Text>
              <TouchableOpacity onPress={() => router.push('/NearbyDoctorsScreen' as any)}>
                <Text style={styles.bookNowText}>Book Appointment</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Emergency Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contact</Text>
          <View style={styles.emergencyCard}>
            <View style={styles.eIcon}>
              <Ionicons name="alert-circle" size={24} color="#fff" />
            </View>
            <View style={{ flex: 1, marginLeft: 15 }}>
              <Text style={styles.eLabel}>In Case of Emergency (ICE)</Text>
              <Text style={styles.eValue}>{profile.emergencyContact || 'Not Set'}</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/SettingsScreen' as any)}>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account & Privacy</Text>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/SettingsScreen' as any)}>
            <View style={[styles.menuIcon, { backgroundColor: '#E1F5FE' }]}>
              <Ionicons name="person" size={20} color="#00B4DB" />
            </View>
            <Text style={styles.menuText}>Personal Details</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/SettingsScreen' as any)}>
            <View style={[styles.menuIcon, { backgroundColor: '#F3E5F5' }]}>
              <Ionicons name="notifications" size={20} color="#9C27B0" />
            </View>
            <Text style={styles.menuText}>Notifications</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/MyRecordsScreen' as any)}>
            <View style={[styles.menuIcon, { backgroundColor: '#E8F5E9' }]}>
              <MaterialCommunityIcons name="file-document" size={20} color="#4CAF50" />
            </View>
            <Text style={styles.menuText}>My Medical Records</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <View style={[styles.menuIcon, { backgroundColor: '#FFEBEE' }]}>
              <Ionicons name="log-out" size={20} color="#FF5252" />
            </View>
            <Text style={[styles.menuText, { color: '#FF5252' }]}>Logout</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.version}>Swasth Saathi v1.0.1</Text>
          <Text style={styles.madeIn}>Made with ❤️ for India 🇮🇳</Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { alignItems: 'center', paddingVertical: 40, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, paddingHorizontal: 20 },
  avatarContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 15, position: 'relative', borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)' },
  avatarText: { fontSize: 40, color: '#fff', fontWeight: 'bold' },
  editAvatarBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#fff', padding: 8, borderRadius: 20, elevation: 2 },
  userName: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  userPhone: { fontSize: 16, color: 'rgba(255,255,255,0.9)', marginTop: 4 },
  userEmail: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  section: { marginTop: 25, paddingHorizontal: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2D3436', marginBottom: 12 },
  editLink: { color: '#00B4DB', fontWeight: 'bold', fontSize: 14 },
  statsCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 20, padding: 20, justifyContent: 'space-between', elevation: 3, alignItems: 'center' },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#2D3436', marginTop: 8 },
  statLabel: { fontSize: 12, color: '#999', marginTop: 2 },
  divider: { width: 1, height: 40, backgroundColor: '#f0f0f0' },
  apptCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, padding: 15, marginBottom: 12, elevation: 2, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3 },
  apptDateBox: { width: 50, height: 50, borderRadius: 12, backgroundColor: '#E0F7FA', justifyContent: 'center', alignItems: 'center' },
  apptDateDay: { fontSize: 16, fontWeight: 'bold', color: '#00B4DB' },
  apptDateMonth: { fontSize: 10, color: '#0083B0', textTransform: 'uppercase' },
  apptDoctor: { fontSize: 16, fontWeight: 'bold', color: '#2D3436' },
  apptSpecialty: { fontSize: 12, color: '#00B4DB' },
  apptHospital: { fontSize: 11, color: '#636E72', marginTop: 1 },
  apptStatus: { backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  apptStatusText: { fontSize: 10, color: '#4CAF50', fontWeight: 'bold' },
  emptyAppt: { alignItems: 'center', padding: 20, backgroundColor: '#fff', borderRadius: 16, borderStyle: 'dashed', borderWidth: 1, borderColor: '#ccc', justifyContent: 'center' },
  emptyApptText: { color: '#999', marginBottom: 10 },
  bookNowText: { color: '#00B4DB', fontWeight: 'bold', fontSize: 14 },
  emergencyCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 16, elevation: 2 },
  eIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#FF4757', justifyContent: 'center', alignItems: 'center' },
  eLabel: { fontSize: 13, color: '#636E72' },
  eValue: { fontSize: 16, fontWeight: 'bold', color: '#2D3436', marginTop: 2 },
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 16, marginBottom: 10, elevation: 1 },
  menuIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  menuText: { flex: 1, marginLeft: 15, fontSize: 16, color: '#2D3436', fontWeight: '500' },
  footer: { alignItems: 'center', paddingVertical: 40 },
  version: { fontSize: 12, color: '#999' },
  madeIn: { fontSize: 12, color: '#ccc', marginTop: 5 },
});
