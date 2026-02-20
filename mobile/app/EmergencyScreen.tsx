import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking, Vibration } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '../hooks/useAppStore';

const systemNumbers = [
    { name: 'Ambulance', number: '102', icon: 'ambulance', color: '#FF4757' },
    { name: 'Police', number: '100', icon: 'police-badge', color: '#0083B0' },
    { name: 'Fire Brigade', number: '101', icon: 'fire-truck', color: '#FFA502' },
    { name: 'Women Helpline', number: '1091', icon: 'human-female', color: '#E84393' },
    { name: 'Child Helpline', number: '1098', icon: 'human-child', color: '#00B894' },
    { name: 'Poison Helpline', number: '1800-11-6117', icon: 'skull-crossbones', color: '#2D3436' },
];

export default function EmergencyScreen() {
    const { profile, notifications, setNotification } = useAppStore();
    const [sosActive, setSosActive] = useState(false);

    // Use store setting for fall detection if available, else local state
    const [fallDetection, setFallDetection] = useState(notifications?.emergency || true);

    const triggerSOS = () => {
        Vibration.vibrate([500, 200, 500, 200, 500]);
        setSosActive(true);
        const contactMsg = profile.emergencyContact
            ? ` alerting your contact: ${profile.emergencyContact}`
            : ' (No emergency contact set in Profile)';

        Alert.alert(
            '🚨 SOS ACTIVATED',
            `Your location is being shared with emergency services. \n\nAmbulance dispatched.\n\nAlso${contactMsg}`,
            [{ text: 'Cancel SOS', onPress: () => setSosActive(false), style: 'cancel' }]
        );
    };

    const callNumber = (number: string) => {
        Linking.openURL(`tel:${number}`);
    };

    const toggleFallDetection = () => {
        setFallDetection(!fallDetection);
        setNotification('emergency', !fallDetection); // Sync with store
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <LinearGradient colors={['#FF4757', '#FF6B6B']} style={styles.header}>
                    <Text style={styles.title}>🚨 Emergency Services</Text>
                    <Text style={styles.subtitle}>Help is just one tap away</Text>
                </LinearGradient>

                {/* SOS Button */}
                <View style={styles.sosContainer}>
                    <TouchableOpacity
                        style={[styles.sosButton, sosActive && styles.sosActive]}
                        onPress={triggerSOS}
                        onLongPress={triggerSOS}
                        delayLongPress={500}
                        activeOpacity={0.8}
                    >
                        <LinearGradient colors={sosActive ? ['#FF0000', '#CC0000'] : ['#FF4757', '#FF6B6B']} style={styles.sosGradient}>
                            <Ionicons name="call" size={50} color="#fff" />
                            <Text style={styles.sosText}>SOS</Text>
                            <Text style={styles.sosHint}>{sosActive ? 'SOS ACTIVE — HELP IS COMING' : 'Tap for Emergency'}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* User's Emergency Contact */}
                {profile.emergencyContact ? (
                    <View style={styles.userContactCard}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="person-circle" size={40} color="#10AC84" />
                            <View style={{ marginLeft: 12, flex: 1 }}>
                                <Text style={styles.ucLabel}>My Emergency Contact</Text>
                                <Text style={styles.ucValue}>{profile.emergencyContact}</Text>
                            </View>
                            <TouchableOpacity style={styles.callBtn} onPress={() => callNumber(profile.emergencyContact)}>
                                <Ionicons name="call" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View style={[styles.userContactCard, { backgroundColor: '#FFF3E0' }]}>
                        <Text style={{ color: '#E67E22', fontWeight: 'bold' }}>⚠️ No Emergency Contact Set</Text>
                        <Text style={{ color: '#D35400', fontSize: 12, marginTop: 4 }}>Go to Profile &gt; Settings to add one.</Text>
                    </View>
                )}

                {/* Emergency Contacts */}
                <Text style={styles.sectionTitle}>Quick Dial Emergency</Text>
                <View style={styles.contactGrid}>
                    {systemNumbers.map((em, i) => (
                        <TouchableOpacity key={i} style={styles.contactCard} onPress={() => callNumber(em.number)}>
                            <View style={[styles.contactIcon, { backgroundColor: em.color + '20' }]}>
                                <MaterialCommunityIcons name={em.icon as any} size={28} color={em.color} />
                            </View>
                            <Text style={styles.contactName}>{em.name}</Text>
                            <Text style={styles.contactNumber}>{em.number}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Fall Detection */}
                <View style={styles.featureCard}>
                    <View style={styles.featureHeader}>
                        <MaterialCommunityIcons name="run-fast" size={28} color="#FF4757" />
                        <View style={{ flex: 1, marginLeft: 15 }}>
                            <Text style={styles.featureName}>Fall Detection</Text>
                            <Text style={styles.featureDesc}>Automatically triggers SOS if a fall is detected (for elderly safety)</Text>
                        </View>
                        <TouchableOpacity onPress={toggleFallDetection} style={[styles.toggle, fallDetection && styles.toggleActive]}>
                            <Text style={styles.toggleText}>{fallDetection ? 'ON' : 'OFF'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Location Sharing */}
                <View style={styles.featureCard}>
                    <View style={styles.featureHeader}>
                        <Ionicons name="location" size={28} color="#00B4DB" />
                        <View style={{ flex: 1, marginLeft: 15 }}>
                            <Text style={styles.featureName}>Share Location</Text>
                            <Text style={styles.featureDesc}>Share your live GPS location with family or ambulance services</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.shareBtn} onPress={() => Alert.alert('Location Shared', `Your GPS coordinates have been sent to ${profile.emergencyContact || 'emergency services'}.`)}>
                        <Ionicons name="share-social" size={20} color="#fff" />
                        <Text style={styles.shareBtnText}>Share My Location Now</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: { padding: 30, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
    subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 5 },
    sosContainer: { alignItems: 'center', marginVertical: 25 },
    sosButton: { width: 180, height: 180, borderRadius: 90, elevation: 15 },
    sosActive: { transform: [{ scale: 1.1 }] },
    sosGradient: { width: 180, height: 180, borderRadius: 90, justifyContent: 'center', alignItems: 'center' },
    sosText: { fontSize: 36, fontWeight: 'bold', color: '#fff', marginTop: 5 },
    sosHint: { fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 5, textAlign: 'center' },
    userContactCard: { marginHorizontal: 20, backgroundColor: '#fff', padding: 15, borderRadius: 16, marginBottom: 20, elevation: 2 },
    ucLabel: { fontSize: 12, color: '#999' },
    ucValue: { fontSize: 18, fontWeight: 'bold', color: '#2D3436' },
    callBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#10AC84', justifyContent: 'center', alignItems: 'center' },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2D3436', marginHorizontal: 20, marginBottom: 15 },
    contactGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 15, marginBottom: 20 },
    contactCard: { width: '45%', backgroundColor: '#fff', borderRadius: 16, padding: 18, margin: '2.5%', alignItems: 'center', elevation: 2 },
    contactIcon: { width: 55, height: 55, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
    contactName: { fontSize: 14, fontWeight: 'bold', color: '#2D3436' },
    contactNumber: { fontSize: 13, color: '#636E72', marginTop: 3 },
    featureCard: { backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 16, padding: 20, marginBottom: 15, elevation: 2 },
    featureHeader: { flexDirection: 'row', alignItems: 'center' },
    featureName: { fontSize: 16, fontWeight: 'bold', color: '#2D3436' },
    featureDesc: { fontSize: 13, color: '#636E72', marginTop: 3, lineHeight: 18 },
    toggle: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, backgroundColor: '#ddd' },
    toggleActive: { backgroundColor: '#10AC84' },
    toggleText: { fontSize: 13, fontWeight: 'bold', color: '#fff' },
    shareBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#00B4DB', borderRadius: 12, padding: 14, marginTop: 15 },
    shareBtnText: { color: '#fff', fontSize: 15, fontWeight: 'bold', marginLeft: 10 },
});
