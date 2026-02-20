import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '../hooks/useAppStore';

const { width } = Dimensions.get('window');

export default function MyHealthScreen() {
  const { moodEntries, meals, medicines, waterGlasses, stepEntries, sleepEntries, addStepEntry, addSleepEntry } = useAppStore();
  const [stepsInput, setStepsInput] = useState('');
  const [sleepInput, setSleepInput] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const last7 = [...Array(7)].map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calculate dynamic health score
  const todayMeds = medicines.filter(m => m.date === today);
  const medScore = todayMeds.length > 0 ? (todayMeds.filter(m => m.taken).length / todayMeds.length) * 25 : 25;
  const waterScore = Math.min(25, (waterGlasses / 8) * 25);
  const todayMood = moodEntries.find(m => m.date === today);
  const moodScore = todayMood ? ((4 - todayMood.mood) / 4) * 25 : 0;
  const todaySteps = stepEntries.find(e => e.date === today)?.steps || 0;
  const stepScore = Math.min(25, (todaySteps / 8000) * 25);
  const healthScore = Math.round(medScore + waterScore + moodScore + stepScore);

  const todayCals = meals.filter(m => m.date === today).reduce((s, m) => s + m.calories, 0);
  const todaySleep = sleepEntries.find(e => e.date === today)?.hours || 0;

  const logSteps = () => {
    const steps = parseInt(stepsInput);
    if (!steps || steps < 0) return Alert.alert('Error', 'Enter valid step count');
    addStepEntry({ date: today, steps });
    setStepsInput('');
    Alert.alert('Logged ✅', `${steps} steps recorded for today`);
  };

  const logSleep = () => {
    const hours = parseFloat(sleepInput);
    if (!hours || hours < 0 || hours > 24) return Alert.alert('Error', 'Enter valid sleep hours');
    addSleepEntry({ date: today, hours });
    setSleepInput('');
    Alert.alert('Logged ✅', `${hours} hours of sleep recorded`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#6C63FF', '#5B54E8']} style={styles.header}>
          <Text style={styles.title}>📊 Health Dashboard</Text>
          <Text style={styles.subtitle}>Your real-time health intelligence</Text>
        </LinearGradient>

        {/* Dynamic Health Score */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreCircle}>
            <Text style={[styles.scoreNum, { color: healthScore >= 70 ? '#10AC84' : healthScore >= 40 ? '#FFA502' : '#FF4757' }]}>{healthScore}</Text>
            <Text style={styles.scoreLabel}>/ 100</Text>
          </View>
          <View style={styles.scoreBreakdown}>
            <View style={styles.breakdownRow}><Text style={styles.bLabel}>💊 Medicine</Text><Text style={styles.bVal}>{Math.round(medScore)}/25</Text></View>
            <View style={styles.breakdownRow}><Text style={styles.bLabel}>💧 Hydration</Text><Text style={styles.bVal}>{Math.round(waterScore)}/25</Text></View>
            <View style={styles.breakdownRow}><Text style={styles.bLabel}>😊 Mood</Text><Text style={styles.bVal}>{Math.round(moodScore)}/25</Text></View>
            <View style={styles.breakdownRow}><Text style={styles.bLabel}>🚶 Steps</Text><Text style={styles.bVal}>{Math.round(stepScore)}/25</Text></View>
          </View>
        </View>

        {/* Today's Stats */}
        <Text style={styles.sectionTitle}>Today's Stats</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="footsteps" size={24} color="#6C63FF" />
            <Text style={styles.statVal}>{todaySteps.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Steps</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="moon" size={24} color="#A29BFE" />
            <Text style={styles.statVal}>{todaySleep ? `${todaySleep}h` : '--'}</Text>
            <Text style={styles.statLabel}>Sleep</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="water" size={24} color="#00B4DB" />
            <Text style={styles.statVal}>{waterGlasses}</Text>
            <Text style={styles.statLabel}>Glasses</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="flame" size={24} color="#FF4757" />
            <Text style={styles.statVal}>{todayCals}</Text>
            <Text style={styles.statLabel}>Calories</Text>
          </View>
        </View>

        {/* Log Steps */}
        <View style={styles.inputCard}>
          <Text style={styles.inputTitle}>🚶 Log Steps</Text>
          <View style={styles.inputRow}>
            <TextInput style={styles.input} placeholder="Steps walked today" value={stepsInput} onChangeText={setStepsInput} keyboardType="numeric" />
            <TouchableOpacity style={styles.logBtn} onPress={logSteps}>
              <Text style={styles.logText}>Log</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Log Sleep */}
        <View style={styles.inputCard}>
          <Text style={styles.inputTitle}>😴 Log Sleep</Text>
          <View style={styles.inputRow}>
            <TextInput style={styles.input} placeholder="Hours slept last night" value={sleepInput} onChangeText={setSleepInput} keyboardType="decimal-pad" />
            <TouchableOpacity style={[styles.logBtn, { backgroundColor: '#A29BFE' }]} onPress={logSleep}>
              <Text style={styles.logText}>Log</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Weekly Steps */}
        <Text style={styles.sectionTitle}>Weekly Steps</Text>
        <View style={styles.graphCard}>
          {stepEntries.length === 0 ? (
            <Text style={styles.emptyText}>Log your steps to see the weekly trend</Text>
          ) : (
            <View style={styles.graph}>
              {last7.map((d, i) => {
                const entry = stepEntries.find(e => e.date === d);
                const steps = entry?.steps || 0;
                const maxSteps = Math.max(...last7.map(dd => stepEntries.find(e => e.date === dd)?.steps || 0), 1);
                const height = (steps / maxSteps) * 80 + 10;
                return (
                  <View key={i} style={styles.graphCol}>
                    <Text style={styles.graphVal}>{steps > 0 ? (steps / 1000).toFixed(1) + 'k' : ''}</Text>
                    <View style={[styles.graphBar, { height, backgroundColor: steps >= 8000 ? '#10AC84' : steps >= 4000 ? '#FFA502' : '#FF4757' }]} />
                    <Text style={styles.graphDay}>{weekDays[new Date(d).getDay()]}</Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Weekly Sleep */}
        <Text style={styles.sectionTitle}>Weekly Sleep</Text>
        <View style={styles.graphCard}>
          {sleepEntries.length === 0 ? (
            <Text style={styles.emptyText}>Log your sleep to see the weekly trend</Text>
          ) : (
            <View style={styles.graph}>
              {last7.map((d, i) => {
                const entry = sleepEntries.find(e => e.date === d);
                const hrs = entry?.hours || 0;
                const height = (hrs / 10) * 80 + 10;
                return (
                  <View key={i} style={styles.graphCol}>
                    <Text style={styles.graphVal}>{hrs > 0 ? hrs + 'h' : ''}</Text>
                    <View style={[styles.graphBar, { height, backgroundColor: hrs >= 7 ? '#6C63FF' : '#FFA502' }]} />
                    <Text style={styles.graphDay}>{weekDays[new Date(d).getDay()]}</Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Mood Trend */}
        <Text style={styles.sectionTitle}>Weekly Mood</Text>
        <View style={styles.graphCard}>
          {moodEntries.length === 0 ? (
            <Text style={styles.emptyText}>Track your mood in Mental Health section</Text>
          ) : (
            <View style={styles.graph}>
              {last7.map((d, i) => {
                const entry = moodEntries.find(m => m.date === d);
                const moods = ['😊', '🙂', '😐', '😔', '😢'];
                return (
                  <View key={i} style={styles.graphCol}>
                    <Text style={{ fontSize: 22 }}>{entry ? moods[entry.mood] : '·'}</Text>
                    <Text style={styles.graphDay}>{weekDays[new Date(d).getDay()]}</Text>
                  </View>
                );
              })}
            </View>
          )}
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
  scoreCard: { flexDirection: 'row', marginHorizontal: 20, marginTop: -15, backgroundColor: '#fff', borderRadius: 20, padding: 20, elevation: 5 },
  scoreCircle: { width: 90, height: 90, borderRadius: 45, borderWidth: 5, borderColor: '#6C63FF', justifyContent: 'center', alignItems: 'center' },
  scoreNum: { fontSize: 30, fontWeight: 'bold' },
  scoreLabel: { fontSize: 12, color: '#999' },
  scoreBreakdown: { flex: 1, marginLeft: 20, justifyContent: 'space-around' },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between' },
  bLabel: { fontSize: 13, color: '#636E72' },
  bVal: { fontSize: 13, fontWeight: 'bold', color: '#2D3436' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2D3436', marginHorizontal: 20, marginTop: 25, marginBottom: 12 },
  statsGrid: { flexDirection: 'row', paddingHorizontal: 15 },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 15, margin: 5, alignItems: 'center', elevation: 2 },
  statVal: { fontSize: 20, fontWeight: 'bold', color: '#2D3436', marginTop: 8 },
  statLabel: { fontSize: 11, color: '#636E72', marginTop: 3 },
  inputCard: { marginHorizontal: 20, marginTop: 15, backgroundColor: '#fff', borderRadius: 16, padding: 18, elevation: 2 },
  inputTitle: { fontSize: 15, fontWeight: 'bold', color: '#2D3436', marginBottom: 10 },
  inputRow: { flexDirection: 'row' },
  input: { flex: 1, backgroundColor: '#F0F2F5', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16 },
  logBtn: { backgroundColor: '#6C63FF', borderRadius: 12, paddingHorizontal: 20, justifyContent: 'center', marginLeft: 10 },
  logText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  graphCard: { marginHorizontal: 20, backgroundColor: '#fff', borderRadius: 16, padding: 20, elevation: 2 },
  emptyText: { textAlign: 'center', color: '#999', fontSize: 14, paddingVertical: 20 },
  graph: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', minHeight: 120 },
  graphCol: { alignItems: 'center', flex: 1 },
  graphVal: { fontSize: 10, color: '#636E72', marginBottom: 3 },
  graphBar: { width: 22, borderRadius: 8, minHeight: 5 },
  graphDay: { marginTop: 8, fontSize: 12, color: '#636E72' },
});
