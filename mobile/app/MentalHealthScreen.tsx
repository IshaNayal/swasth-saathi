import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '../hooks/useAppStore';

const moodEmojis = [
    { emoji: '😊', label: 'Great', color: '#10AC84' },
    { emoji: '🙂', label: 'Good', color: '#00B4DB' },
    { emoji: '😐', label: 'Okay', color: '#FFA502' },
    { emoji: '😔', label: 'Low', color: '#FF6B6B' },
    { emoji: '😢', label: 'Bad', color: '#FF4757' },
];

const breathingExercises = [
    { name: 'Box Breathing', desc: 'Inhale 4s → Hold 4s → Exhale 4s → Hold 4s', icon: 'square-outline', duration: '4 min' },
    { name: 'Pranayama - Anulom Vilom', desc: 'Alternate nostril breathing for calmness', icon: 'leaf', duration: '10 min' },
];

const helplines = [
    { name: 'Vandrevala Foundation', number: '1860-2662-345', available: '24/7' },
    { name: 'iCall', number: '9152987821', available: 'Mon-Sat 8AM-10PM' },
    { name: 'NIMHANS Helpline', number: '080-46110007', available: '24/7' },
];

export default function MentalHealthScreen() {
    const { moodEntries, addMoodEntry } = useAppStore();
    const [selectedMood, setSelectedMood] = useState<number | null>(null);
    const [stressLevel, setStressLevel] = useState(5);
    const [journalEntry, setJournalEntry] = useState('');
    const [anonymous, setAnonymous] = useState(true);

    const today = new Date().toISOString().split('T')[0];
    const last7 = [...Array(7)].map((_, i) => {
        const d = new Date(); d.setDate(d.getDate() - (6 - i));
        return d.toISOString().split('T')[0];
    });
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const saveMoodEntry = () => {
        if (selectedMood === null) return Alert.alert('Select mood', 'Please select how you are feeling');
        addMoodEntry({ mood: selectedMood, stressLevel, journal: journalEntry, date: today });
        Alert.alert('Saved ✅', 'Your mood has been recorded.');
        setSelectedMood(null); setJournalEntry('');
    };

    const todayEntry = moodEntries.find(m => m.date === today);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <LinearGradient colors={['#6C63FF', '#A29BFE']} style={styles.header}>
                    <Text style={styles.title}>🧠 Mental Wellness</Text>
                    <Text style={styles.subtitle}>Your mind matters. Track your journey.</Text>
                    <TouchableOpacity style={styles.anonBadge} onPress={() => setAnonymous(!anonymous)}>
                        <Ionicons name={anonymous ? 'eye-off' : 'eye'} size={16} color="#fff" />
                        <Text style={styles.anonText}>{anonymous ? 'Anonymous ON' : 'Anonymous OFF'}</Text>
                    </TouchableOpacity>
                </LinearGradient>

                {/* Today's Entry Status */}
                {todayEntry && (
                    <View style={styles.todayBanner}>
                        <Text style={styles.todayEmoji}>{moodEmojis[todayEntry.mood].emoji}</Text>
                        <Text style={styles.todayText}>Today you felt: {moodEmojis[todayEntry.mood].label} (Stress: {todayEntry.stressLevel}/10)</Text>
                    </View>
                )}

                {/* Mood Tracker */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>How are you feeling right now?</Text>
                    <View style={styles.moodRow}>
                        {moodEmojis.map((m, i) => (
                            <TouchableOpacity key={i} style={[styles.moodItem, selectedMood === i && { backgroundColor: m.color + '30', borderColor: m.color, borderWidth: 2 }]} onPress={() => setSelectedMood(i)}>
                                <Text style={styles.moodEmoji}>{m.emoji}</Text>
                                <Text style={[styles.moodLabel, { color: m.color }]}>{m.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Weekly Mood Graph (from real data) */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Your Weekly Mood</Text>
                    {moodEntries.length === 0 ? (
                        <View style={styles.emptyGraph}>
                            <Text style={styles.emptyGraphText}>No mood data yet. Start tracking today!</Text>
                        </View>
                    ) : (
                        <View style={styles.graphContainer}>
                            {last7.map((d, i) => {
                                const entry = moodEntries.find(m => m.date === d);
                                const height = entry ? (4 - entry.mood) * 20 + 20 : 10;
                                const color = entry ? moodEmojis[entry.mood].color : '#E0E0E0';
                                return (
                                    <View key={i} style={styles.graphBar}>
                                        <View style={[styles.bar, { height, backgroundColor: color }]} />
                                        <Text style={styles.graphDay}>{weekDays[new Date(d).getDay() === 0 ? 6 : new Date(d).getDay() - 1]}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    )}
                </View>

                {/* Stress Scale */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Stress Level</Text>
                    <View style={styles.stressRow}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                            <TouchableOpacity key={n} style={[styles.stressDot, { backgroundColor: n <= stressLevel ? (n <= 3 ? '#10AC84' : n <= 7 ? '#FFA502' : '#FF4757') : '#E0E0E0' }]} onPress={() => setStressLevel(n)}>
                                <Text style={styles.stressNum}>{n}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text style={styles.stressLabel}>{stressLevel <= 3 ? '😌 Low stress' : stressLevel <= 7 ? '😟 Moderate stress' : '😰 High stress — consider talking to someone'}</Text>
                </View>

                {/* Journal */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📝 Gratitude Journal</Text>
                    <TextInput style={styles.journalInput} placeholder="What are you grateful for today?" value={journalEntry} onChangeText={setJournalEntry} multiline numberOfLines={3} />
                    <TouchableOpacity style={styles.saveBtn} onPress={saveMoodEntry}>
                        <Text style={styles.saveBtnText}>Save Today's Entry</Text>
                    </TouchableOpacity>
                </View>

                {/* Past Entries */}
                {moodEntries.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>📋 Past Entries ({moodEntries.length})</Text>
                        {moodEntries.slice(-5).reverse().map((e, i) => (
                            <View key={i} style={styles.pastEntry}>
                                <Text style={styles.pastEmoji}>{moodEmojis[e.mood].emoji}</Text>
                                <View style={{ flex: 1, marginLeft: 12 }}>
                                    <Text style={styles.pastDate}>{e.date} • Stress: {e.stressLevel}/10</Text>
                                    {e.journal ? <Text style={styles.pastJournal}>{e.journal}</Text> : null}
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {/* Breathing */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🧘 Breathing Exercises</Text>
                    {breathingExercises.map((ex, i) => (
                        <TouchableOpacity key={i} style={styles.exerciseCard}>
                            <Ionicons name={ex.icon as any} size={28} color="#6C63FF" style={{ marginRight: 15 }} />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.exName}>{ex.name}</Text>
                                <Text style={styles.exDesc}>{ex.desc}</Text>
                            </View>
                            <Text style={styles.exDuration}>{ex.duration}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Crisis Helplines */}
                <View style={[styles.section, { backgroundColor: '#FFF5F5', marginHorizontal: 0, paddingHorizontal: 20, paddingVertical: 20 }]}>
                    <Text style={[styles.sectionTitle, { color: '#FF4757' }]}>🆘 Crisis Helplines</Text>
                    {helplines.map((h, i) => (
                        <View key={i} style={styles.helplineCard}>
                            <Ionicons name="call" size={20} color="#FF4757" />
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <Text style={styles.helpName}>{h.name}</Text>
                                <Text style={styles.helpAvail}>{h.available}</Text>
                            </View>
                            <Text style={styles.helpNum}>{h.number}</Text>
                        </View>
                    ))}
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
    anonBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginTop: 15, alignSelf: 'flex-start' },
    anonText: { color: '#fff', marginLeft: 8, fontSize: 13 },
    todayBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F8F5', marginHorizontal: 20, marginTop: 15, borderRadius: 12, padding: 15 },
    todayEmoji: { fontSize: 30 },
    todayText: { marginLeft: 12, fontSize: 14, color: '#2D3436', fontWeight: '500' },
    section: { marginHorizontal: 20, marginTop: 25 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2D3436', marginBottom: 15 },
    moodRow: { flexDirection: 'row', justifyContent: 'space-between' },
    moodItem: { alignItems: 'center', padding: 12, borderRadius: 16, width: 65, backgroundColor: '#fff', elevation: 2 },
    moodEmoji: { fontSize: 30 },
    moodLabel: { fontSize: 11, marginTop: 5, fontWeight: '600' },
    emptyGraph: { backgroundColor: '#fff', borderRadius: 16, padding: 30, alignItems: 'center', elevation: 1 },
    emptyGraphText: { color: '#999', fontSize: 14 },
    graphContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 120, backgroundColor: '#fff', borderRadius: 16, padding: 15, elevation: 2 },
    graphBar: { alignItems: 'center' },
    bar: { width: 25, borderRadius: 8 },
    graphDay: { marginTop: 8, fontSize: 12, color: '#636E72' },
    stressRow: { flexDirection: 'row', justifyContent: 'space-between' },
    stressDot: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
    stressNum: { fontSize: 12, color: '#fff', fontWeight: 'bold' },
    stressLabel: { textAlign: 'center', marginTop: 10, fontSize: 14, color: '#636E72' },
    journalInput: { backgroundColor: '#fff', borderRadius: 16, padding: 18, fontSize: 16, textAlignVertical: 'top', elevation: 2, minHeight: 80 },
    saveBtn: { backgroundColor: '#6C63FF', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 12 },
    saveBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    pastEntry: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 10, elevation: 1 },
    pastEmoji: { fontSize: 28 },
    pastDate: { fontSize: 13, color: '#636E72' },
    pastJournal: { fontSize: 14, color: '#2D3436', marginTop: 3 },
    exerciseCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 12, elevation: 2 },
    exName: { fontSize: 16, fontWeight: 'bold', color: '#2D3436' },
    exDesc: { fontSize: 13, color: '#636E72', marginTop: 3 },
    exDuration: { fontSize: 12, color: '#6C63FF', fontWeight: 'bold' },
    helplineCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 10 },
    helpName: { fontSize: 15, fontWeight: 'bold', color: '#2D3436' },
    helpAvail: { fontSize: 12, color: '#636E72' },
    helpNum: { fontSize: 13, color: '#FF4757', fontWeight: 'bold' },
});
