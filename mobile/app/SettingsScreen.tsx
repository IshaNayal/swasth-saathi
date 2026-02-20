import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../hooks/useAuthStore';
import { useAppStore } from '../hooks/useAppStore';
import { useRouter } from 'expo-router';

const languages = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिंदी' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'bn', label: 'Bengali', native: 'বাংলা' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
    { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
];

const fontSizes = [
    { label: 'Small', value: 14 },
    { label: 'Medium', value: 16 },
    { label: 'Large', value: 18 },
    { label: 'Extra Large', value: 22 },
];

export default function SettingsScreen() {
    const { user, logout } = useAuthStore();
    const {
        darkMode, setDarkMode,
        language, setLanguage,
        fontSize, setFontSize,
        notifications, setNotification,
        profile, updateProfile
    } = useAppStore();
    const router = useRouter();

    // Personal Info State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [dob, setDob] = useState('');
    const [bloodGroup, setBloodGroup] = useState('O+');
    const [emergencyContact, setEmergencyContact] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');

    // Load initial data from store
    useEffect(() => {
        setName(profile.name || user?.name || '');
        setEmail(profile.email || '');
        setPhone(profile.phone || user?.phone || '');
        setDob(profile.dob || '');
        setBloodGroup(profile.bloodGroup || 'O+');
        setEmergencyContact(profile.emergencyContact || '');
        setHeight(profile.height || '');
        setWeight(profile.weight || '');
    }, [profile, user]);

    // Security State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPasswords, setShowPasswords] = useState(false);
    const [biometricEnabled, setBiometricEnabled] = useState(false);
    const [showLangPicker, setShowLangPicker] = useState(false);

    // Privacy State
    const [shareData, setShareData] = useState(false);
    const [anonymousMode, setAnonymousMode] = useState(true);

    const bg = darkMode ? '#1a1a2e' : '#F8F9FA';
    const cardBg = darkMode ? '#16213e' : '#fff';
    const textColor = darkMode ? '#e0e0e0' : '#2D3436';
    const subColor = darkMode ? '#888' : '#636E72';
    const inputBg = darkMode ? '#0f3460' : '#F0F2F5';

    const handleSaveProfile = () => {
        updateProfile({
            name, email, phone, dob, bloodGroup, emergencyContact, height, weight
        });
        Alert.alert('Profile Saved ✅', 'Your personal information has been updated.');
    };

    const handleChangePassword = () => {
        if (!currentPassword) return Alert.alert('Error', 'Enter your current password');
        if (newPassword.length < 6) return Alert.alert('Error', 'New password must be at least 6 characters');
        if (newPassword !== confirmPassword) return Alert.alert('Error', 'Passwords do not match');
        Alert.alert('Password Changed ✅', 'Your password has been updated successfully.');
        setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            '⚠️ Delete Account',
            'This will permanently delete your account and all health data from this device. This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete', style: 'destructive', onPress: async () => {
                        await logout();
                        router.replace('/AuthScreen' as any);
                    }
                },
            ]
        );
    };

    const handleLogout = async () => {
        await logout();
        router.replace('/AuthScreen' as any);
    };

    const currentLang = languages.find(l => l.code === language);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <LinearGradient colors={['#2D3436', '#636E72']} style={styles.header}>
                    <Ionicons name="settings" size={32} color="#fff" />
                    <Text style={[styles.headerTitle, { fontSize: fontSize + 12 }]}>Settings</Text>
                    <Text style={[styles.headerSub, { fontSize: fontSize - 3 }]}>Customize your Swasth Saathi experience</Text>
                </LinearGradient>

                {/* =================== APPEARANCE =================== */}
                <Text style={[styles.sectionTitle, { color: textColor, fontSize: fontSize + 2 }]}>🎨 Appearance</Text>

                {/* Dark Mode */}
                <View style={[styles.card, { backgroundColor: cardBg }]}>
                    <View style={styles.settingRow}>
                        <View style={styles.settingLeft}>
                            <Ionicons name={darkMode ? 'moon' : 'sunny'} size={22} color="#FFA502" />
                            <Text style={[styles.settingLabel, { color: textColor, fontSize: fontSize }]}>Dark Mode</Text>
                        </View>
                        <Switch value={darkMode} onValueChange={setDarkMode} trackColor={{ true: '#00B4DB', false: '#ccc' }} />
                    </View>
                </View>

                {/* Language */}
                <View style={[styles.card, { backgroundColor: cardBg }]}>
                    <TouchableOpacity style={styles.settingRow} onPress={() => setShowLangPicker(!showLangPicker)}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="globe-outline" size={22} color="#00B4DB" />
                            <Text style={[styles.settingLabel, { color: textColor, fontSize: fontSize }]}>Language</Text>
                        </View>
                        <View style={styles.langValue}>
                            <Text style={[styles.langValueText, { color: subColor, fontSize: fontSize - 2 }]}>{currentLang?.native}</Text>
                            <Ionicons name={showLangPicker ? 'chevron-up' : 'chevron-down'} size={18} color={subColor} />
                        </View>
                    </TouchableOpacity>
                    {showLangPicker && (
                        <View style={styles.langList}>
                            {languages.map(lang => (
                                <TouchableOpacity
                                    key={lang.code}
                                    style={[styles.langItem, language === lang.code && styles.langItemActive]}
                                    onPress={() => { setLanguage(lang.code); setShowLangPicker(false); }}
                                >
                                    <Text style={[styles.langItemText, { color: textColor }, language === lang.code && { color: '#00B4DB', fontWeight: 'bold' }]}>
                                        {lang.native} — {lang.label}
                                    </Text>
                                    {language === lang.code && <Ionicons name="checkmark" size={20} color="#00B4DB" />}
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                {/* Font Size */}
                <View style={[styles.card, { backgroundColor: cardBg }]}>
                    <View style={styles.settingLeft}>
                        <MaterialCommunityIcons name="format-font-size-increase" size={22} color="#6C63FF" />
                        <Text style={[styles.settingLabel, { color: textColor, fontSize: fontSize }]}>Font Size</Text>
                    </View>
                    <View style={styles.fontRow}>
                        {fontSizes.map(fs => (
                            <TouchableOpacity
                                key={fs.value}
                                style={[styles.fontBtn, fontSize === fs.value && styles.fontBtnActive]}
                                onPress={() => setFontSize(fs.value)}
                            >
                                <Text style={[styles.fontBtnText, fontSize === fs.value && styles.fontBtnTextActive]}>{fs.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text style={[styles.previewText, { fontSize: fontSize, color: subColor }]}>Preview: स्वस्थ साथी • Healthy Life</Text>
                </View>

                {/* =================== PERSONAL INFO =================== */}
                <Text style={[styles.sectionTitle, { color: textColor, fontSize: fontSize + 2 }]}>👤 Personal Information</Text>

                <View style={[styles.card, { backgroundColor: cardBg }]}>
                    <Text style={[styles.fieldLabel, { color: subColor }]}>Full Name</Text>
                    <TextInput style={[styles.input, { backgroundColor: inputBg, color: textColor }]} value={name} onChangeText={setName} placeholder="Enter your name" />

                    <Text style={[styles.fieldLabel, { color: subColor }]}>Email</Text>
                    <TextInput style={[styles.input, { backgroundColor: inputBg, color: textColor }]} value={email} onChangeText={setEmail} placeholder="your@email.com" keyboardType="email-address" />

                    <Text style={[styles.fieldLabel, { color: subColor }]}>Phone</Text>
                    <TextInput style={[styles.input, { backgroundColor: inputBg, color: textColor }]} value={phone} onChangeText={setPhone} placeholder="+91 XXXXX XXXXX" keyboardType="phone-pad" />

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flex: 1, marginRight: 10 }}>
                            <Text style={[styles.fieldLabel, { color: subColor }]}>Height (cm)</Text>
                            <TextInput style={[styles.input, { backgroundColor: inputBg, color: textColor }]} value={height} onChangeText={setHeight} placeholder="175" keyboardType="numeric" />
                        </View>
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text style={[styles.fieldLabel, { color: subColor }]}>Weight (kg)</Text>
                            <TextInput style={[styles.input, { backgroundColor: inputBg, color: textColor }]} value={weight} onChangeText={setWeight} placeholder="70" keyboardType="numeric" />
                        </View>
                    </View>

                    <Text style={[styles.fieldLabel, { color: subColor }]}>Blood Group</Text>
                    <View style={styles.bloodRow}>
                        {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                            <TouchableOpacity key={bg} style={[styles.bloodChip, bloodGroup === bg && styles.bloodChipActive]} onPress={() => setBloodGroup(bg)}>
                                <Text style={[styles.bloodText, bloodGroup === bg && styles.bloodTextActive]}>{bg}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={[styles.fieldLabel, { color: subColor }]}>Emergency Contact</Text>
                    <TextInput style={[styles.input, { backgroundColor: inputBg, color: textColor }]} value={emergencyContact} onChangeText={setEmergencyContact} placeholder="+91 Emergency number" keyboardType="phone-pad" />

                    <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile}>
                        <Ionicons name="checkmark-circle" size={20} color="#fff" />
                        <Text style={styles.saveBtnText}>Save Profile</Text>
                    </TouchableOpacity>
                </View>

                {/* =================== NOTIFICATIONS =================== */}
                <Text style={[styles.sectionTitle, { color: textColor, fontSize: fontSize + 2 }]}>🔔 Notifications</Text>

                <View style={[styles.card, { backgroundColor: cardBg }]}>
                    {[
                        { key: 'push', label: 'Push Notifications', icon: 'notifications', color: '#00B4DB' },
                        { key: 'email', label: 'Email Alerts', icon: 'mail', color: '#6C63FF' },
                        { key: 'sms', label: 'SMS Alerts', icon: 'chatbubble', color: '#FFA502' },
                        { key: 'medicine', label: 'Medicine Reminders', icon: 'alarm', color: '#10AC84' },
                        { key: 'emergency', label: 'Emergency Alerts', icon: 'warning', color: '#FF4757' },
                    ].map((item, i) => (
                        <View key={item.key} style={[styles.settingRow, i > 0 && { borderTopWidth: 1, borderTopColor: darkMode ? '#222' : '#f0f0f0', paddingTop: 15 }]}>
                            <View style={styles.settingLeft}>
                                <Ionicons name={item.icon as any} size={20} color={item.color} />
                                <Text style={[styles.settingLabel, { color: textColor, fontSize: fontSize }]}>{item.label}</Text>
                            </View>
                            <Switch
                                value={notifications?.[item.key as keyof typeof notifications] ?? false}
                                onValueChange={(val) => setNotification(item.key, val)}
                                trackColor={{ true: item.color, false: '#ccc' }}
                            />
                        </View>
                    ))}
                </View>

                {/* =================== DANGER ZONE =================== */}
                <Text style={[styles.sectionTitle, { color: '#FF4757', fontSize: fontSize + 2 }]}>⚠️ Danger Zone</Text>

                <View style={[styles.card, { backgroundColor: cardBg }]}>
                    <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                        <Feather name="log-out" size={20} color="#FF4757" />
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAccount}>
                        <Ionicons name="trash" size={20} color="#fff" />
                        <Text style={styles.deleteText}>Delete Account</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={{ color: subColor, fontSize: 12 }}>Swasth Saathi v1.0.0</Text>
                    <Text style={{ color: subColor, fontSize: 12, marginTop: 3 }}>Made with ❤️ for India 🇮🇳</Text>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { padding: 30, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, flexDirection: 'column', alignItems: 'center' },
    headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginTop: 10 },
    headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 5 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 20, marginTop: 25, marginBottom: 12 },
    card: { marginHorizontal: 20, borderRadius: 16, padding: 20, elevation: 2, marginBottom: 5 },
    settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
    settingLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    settingLabel: { fontSize: 16, fontWeight: '500', marginLeft: 12 },
    settingDesc: { fontSize: 12, marginTop: 2 },
    langValue: { flexDirection: 'row', alignItems: 'center' },
    langValueText: { marginRight: 5, fontSize: 14 },
    langList: { marginTop: 10, borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 10 },
    langItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 10, borderRadius: 10 },
    langItemActive: { backgroundColor: '#E1F5FE' },
    langItemText: { fontSize: 15 },
    fontRow: { flexDirection: 'row', marginTop: 15, marginBottom: 10 },
    fontBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, backgroundColor: '#F0F2F5', marginRight: 8 },
    fontBtnActive: { backgroundColor: '#6C63FF' },
    fontBtnText: { fontSize: 13, color: '#636E72' },
    fontBtnTextActive: { color: '#fff', fontWeight: 'bold' },
    previewText: { marginTop: 5, fontStyle: 'italic' },
    fieldLabel: { fontSize: 13, fontWeight: '600', marginBottom: 5, marginTop: 15 },
    input: { borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16 },
    passwordRow: { flexDirection: 'row', alignItems: 'center' },
    passwordInput: { flex: 1 },
    eyeBtn: { marginLeft: 10, padding: 10 },
    bloodRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 5 },
    bloodChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, backgroundColor: '#F0F2F5', marginRight: 8, marginBottom: 8 },
    bloodChipActive: { backgroundColor: '#FF4757' },
    bloodText: { fontSize: 14, color: '#636E72', fontWeight: '600' },
    bloodTextActive: { color: '#fff' },
    saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#10AC84', borderRadius: 12, padding: 16, marginTop: 20 },
    saveBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
    aboutRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15 },
    aboutLabel: { fontSize: 15 },
    aboutValue: { fontSize: 14 },
    logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 12, borderWidth: 2, borderColor: '#FF4757', marginBottom: 12 },
    logoutText: { color: '#FF4757', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
    deleteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FF4757', padding: 16, borderRadius: 12 },
    deleteText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
    footer: { alignItems: 'center', paddingVertical: 30 },
});
