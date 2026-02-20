import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppStore } from '../hooks/useAppStore';

interface Message {
  id: string;
  text: string;
  sender: 'ai' | 'user';
  timestamp: Date;
}

const CheckSymptomsScreen = () => {
  const { addSymptomLog } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I am your Swasth Saathi AI. What symptoms are you experiencing today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0); // 0: symptom, 1: duration, 2: severity, 3: result
  const [symptomData, setSymptomData] = useState({ symptom: '', duration: '', severity: '' });
  const flatListRef = useRef<FlatList>(null);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const input = inputText;
    setInputText('');
    setLoading(true);

    // Simulate AI delay
    setTimeout(() => {
      let aiText = "";
      let nextStep = step;

      if (step === 0) {
        setSymptomData(prev => ({ ...prev, symptom: input }));
        aiText = "Understood. How long have you been experiencing this?";
        nextStep = 1;
      } else if (step === 1) {
        setSymptomData(prev => ({ ...prev, duration: input }));
        aiText = "On a scale of 1 to 10, how severe is the discomfort?";
        nextStep = 2;
      } else if (step === 2) {
        const severityChat = input;
        setSymptomData(prev => ({ ...prev, severity: severityChat }));

        // Offline AI mock analysis
        const sev = parseInt(severityChat) || 5;
        const riskCategory = sev >= 8 ? 'Emergency' : sev >= 5 ? 'Moderate' : 'Mild';

        let conditions = ['General Viral Infection', 'Dehydration', 'Fatigue'];
        const s = symptomData.symptom.toLowerCase();
        if (s.includes('head')) conditions = ['Tension Headache', 'Migraine', 'Sinusitis'];
        else if (s.includes('fever')) conditions = ['Viral Fever', 'Common Flu', 'Dengue (monitor)'];
        else if (s.includes('stomach') || s.includes('pain')) conditions = ['Gastritis', 'Food Poisoning', 'Acidity'];
        else if (s.includes('chest')) conditions = ['Acid Reflux', 'Muscle Strain', 'Angina (Consult Doctor)'];

        const recommendation = sev >= 8
          ? 'Please visit a doctor immediately or call emergency services.'
          : sev >= 5
            ? 'Rest and hydrate. If symptoms persist for 48+ hours, consult a doctor.'
            : 'Home remedies should suffice. Monitor for any worsening.';

        aiText = `🔍 ANALYSIS COMPLETE:\n\nPossible Conditions: ${conditions.join(', ')}\nRisk Category: ${riskCategory.toUpperCase()}\nSeverity Score: ${sev}/10\n\nRecommendation: ${recommendation}\n\n⚠️ Disclaimer: This is an AI-based preliminary assessment and not a medical diagnosis.`;

        // Save to Store
        addSymptomLog({
          symptoms: [symptomData.symptom],
          duration: symptomData.duration,
          severity: sev,
          prediction: conditions[0],
          riskCategory: riskCategory,
          date: new Date().toISOString().split('T')[0]
        });

        nextStep = 3; // Reset or End
      } else {
        aiText = "If you have more symptoms, please type them below to start a new assessment.";
        setStep(0);
        setLoading(false);
        // Don't add another message if we just reset
        const resetMsg: Message = { id: Date.now().toString(), text: aiText, sender: 'ai', timestamp: new Date() };
        setMessages(prev => [...prev, resetMsg]);
        return;
      }

      setStep(nextStep);
      const aiMessage: Message = {
        id: Date.now().toString(),
        text: aiText,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.messageWrapper, item.sender === 'user' ? styles.userWrapper : styles.aiWrapper]}>
      {item.sender === 'ai' && (
        <View style={styles.botIcon}>
          <MaterialCommunityIcons name="robot" size={20} color="#fff" />
        </View>
      )}
      <View style={[styles.messageBubble, item.sender === 'user' ? styles.userBubble : styles.aiBubble]}>
        <Text style={[styles.messageText, item.sender === 'user' ? styles.userText : styles.aiText]}>
          {item.text}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Symptom Triage</Text>
        <TouchableOpacity style={styles.resetBtn} onPress={() => { setMessages([messages[0]]); setStep(0); }}>
          <Ionicons name="refresh" size={24} color="#00B4DB" />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatList}
        showsVerticalScrollIndicator={false}
      />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#00B4DB" />
          <Text style={styles.loadingText}>AI is analyzing...</Text>
        </View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputArea}>
          <TextInput
            style={styles.input}
            placeholder={step === 0 ? "Describe your symptoms..." : "Type here..."}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
            <Ionicons name="send" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', backgroundColor: '#fff', elevation: 2 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#2D3436' },
  resetBtn: { padding: 5 },
  chatList: { padding: 15, paddingBottom: 20 },
  messageWrapper: { flexDirection: 'row', marginBottom: 15, alignItems: 'flex-end' },
  userWrapper: { justifyContent: 'flex-end' },
  aiWrapper: { justifyContent: 'flex-start' },
  botIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#00B4DB', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  messageBubble: { maxWidth: '80%', padding: 14, borderRadius: 20, elevation: 1 },
  userBubble: { backgroundColor: '#00B4DB', borderBottomRightRadius: 2 },
  aiBubble: { backgroundColor: '#F0F2F5', borderBottomLeftRadius: 2 },
  messageText: { fontSize: 16, lineHeight: 22 },
  userText: { color: '#fff' },
  aiText: { color: '#2D3436' },
  loadingContainer: { flexDirection: 'row', alignItems: 'center', marginLeft: 20, marginBottom: 10 },
  loadingText: { fontSize: 14, color: '#999', marginLeft: 10, fontStyle: 'italic' },
  inputArea: { flexDirection: 'row', padding: 15, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f0f0f0', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#F0F2F5', borderRadius: 25, paddingHorizontal: 20, paddingVertical: 12, marginRight: 10, fontSize: 16, maxHeight: 100 },
  sendBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#0083B0', justifyContent: 'center', alignItems: 'center', elevation: 2 },
});

export default CheckSymptomsScreen;
