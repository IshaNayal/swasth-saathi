import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '../hooks/useAppStore';

const ratingEmojis = ['😡', '😕', '😐', '🙂', '😍'];
const categories = ['Bug Report', 'Feature Request', 'UI/UX', 'Performance', 'Other'];

export default function FeedbackScreen() {
    const { feedbackEntries, addFeedback } = useAppStore();
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [category, setCategory] = useState('');

    const submitFeedback = () => {
        if (!rating) return Alert.alert('Please rate', 'Select a rating before submitting.');
        addFeedback({ rating, category, text: feedback, date: new Date().toISOString().split('T')[0] });
        Alert.alert('Thank you! 🙏', 'Your feedback helps us build a better healthcare platform.');
        setRating(0); setFeedback(''); setCategory('');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <LinearGradient colors={['#10AC84', '#1DD1A1']} style={styles.header}>
                    <Text style={styles.title}>📝 Feedback</Text>
                    <Text style={styles.subtitle}>Help us improve Swasth Saathi</Text>
                </LinearGradient>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>How's your experience?</Text>
                    <View style={styles.ratingRow}>
                        {ratingEmojis.map((emoji, i) => (
                            <TouchableOpacity key={i} style={[styles.ratingItem, rating === i + 1 && styles.ratingSelected]} onPress={() => setRating(i + 1)}>
                                <Text style={styles.ratingEmoji}>{emoji}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Category</Text>
                    <View style={styles.catRow}>
                        {categories.map(cat => (
                            <TouchableOpacity key={cat} style={[styles.catChip, category === cat && styles.catChipActive]} onPress={() => setCategory(cat)}>
                                <Text style={[styles.catText, category === cat && styles.catTextActive]}>{cat}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Your feedback</Text>
                    <TextInput style={styles.textArea} placeholder="Tell us what you think..." value={feedback} onChangeText={setFeedback} multiline numberOfLines={5} />
                </View>

                <TouchableOpacity style={styles.submitBtn} onPress={submitFeedback}>
                    <Text style={styles.submitText}>Submit Feedback</Text>
                    <Ionicons name="send" size={20} color="#fff" />
                </TouchableOpacity>

                {/* Past Feedback */}
                {feedbackEntries.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Your Submissions ({feedbackEntries.length})</Text>
                        {feedbackEntries.slice().reverse().map((fb, i) => (
                            <View key={i} style={styles.pastCard}>
                                <Text style={styles.pastEmoji}>{ratingEmojis[fb.rating - 1]}</Text>
                                <View style={{ flex: 1, marginLeft: 12 }}>
                                    <Text style={styles.pastCategory}>{fb.category || 'General'} • {fb.date}</Text>
                                    {fb.text ? <Text style={styles.pastText}>{fb.text}</Text> : null}
                                </View>
                            </View>
                        ))}
                    </View>
                )}

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
    section: { marginHorizontal: 20, marginTop: 25 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2D3436', marginBottom: 15 },
    ratingRow: { flexDirection: 'row', justifyContent: 'space-between' },
    ratingItem: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', elevation: 2 },
    ratingSelected: { backgroundColor: '#10AC84', elevation: 5 },
    ratingEmoji: { fontSize: 30 },
    catRow: { flexDirection: 'row', flexWrap: 'wrap' },
    catChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: '#fff', marginRight: 10, marginBottom: 10, elevation: 1 },
    catChipActive: { backgroundColor: '#10AC84' },
    catText: { fontSize: 14, color: '#636E72' },
    catTextActive: { color: '#fff', fontWeight: 'bold' },
    textArea: { backgroundColor: '#fff', borderRadius: 16, padding: 18, fontSize: 16, textAlignVertical: 'top', elevation: 2, minHeight: 120 },
    submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#10AC84', marginHorizontal: 20, borderRadius: 16, padding: 18, marginTop: 25 },
    submitText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginRight: 10 },
    pastCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 10, elevation: 1 },
    pastEmoji: { fontSize: 28 },
    pastCategory: { fontSize: 13, color: '#636E72' },
    pastText: { fontSize: 14, color: '#2D3436', marginTop: 3 },
});
