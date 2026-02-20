import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ScrollView, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useAppStore } from '../hooks/useAppStore';

const MedicinesScreen = () => {
  const { medicines, addMedicine, removeMedicine, toggleMedicineTaken } = useAppStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDosage, setNewDosage] = useState('');
  const [newTime, setNewTime] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const todayMeds = medicines.filter(m => m.date === today);

  const handleAdd = () => {
    if (!newName.trim()) return Alert.alert('Error', 'Enter medicine name');
    if (!newTime.trim()) return Alert.alert('Error', 'Enter time (e.g. 08:00 AM)');
    addMedicine({ name: newName, dosage: newDosage || '1 tablet', time: newTime, taken: false, date: today });
    setNewName(''); setNewDosage(''); setNewTime('');
    setShowAdd(false);
  };

  const takenCount = todayMeds.filter(m => m.taken).length;
  const totalCount = todayMeds.length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>💊 My Medicines</Text>
          <Text style={styles.subtitle}>
            {totalCount === 0 ? 'No medicines added yet' : `${takenCount}/${totalCount} taken today`}
          </Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowAdd(true)}>
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Progress */}
      {totalCount > 0 && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(takenCount / totalCount) * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>{Math.round((takenCount / totalCount) * 100)}% done</Text>
        </View>
      )}

      {/* Medicine List */}
      {todayMeds.length === 0 ? (
        <View style={styles.emptyState}>
          <FontAwesome5 name="pills" size={60} color="#ccc" />
          <Text style={styles.emptyTitle}>No medicines scheduled</Text>
          <Text style={styles.emptySubtitle}>Tap + to add your daily medicines</Text>
        </View>
      ) : (
        <FlatList
          data={todayMeds}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={[styles.medCard, item.taken && styles.medCardTaken]}>
              <TouchableOpacity style={[styles.checkBtn, item.taken && styles.checkBtnDone]} onPress={() => toggleMedicineTaken(item.id)}>
                <Ionicons name={item.taken ? 'checkmark' : 'ellipse-outline'} size={24} color={item.taken ? '#fff' : '#ccc'} />
              </TouchableOpacity>
              <View style={styles.medInfo}>
                <Text style={[styles.medName, item.taken && styles.medNameTaken]}>{item.name}</Text>
                <Text style={styles.medDosage}>{item.dosage} • {item.time}</Text>
              </View>
              <TouchableOpacity onPress={() => {
                Alert.alert('Delete', `Remove ${item.name}?`, [
                  { text: 'Cancel' },
                  { text: 'Delete', style: 'destructive', onPress: () => removeMedicine(item.id) },
                ]);
              }}>
                <Ionicons name="trash-outline" size={20} color="#FF4757" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {/* Add Medicine Modal */}
      <Modal visible={showAdd} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Medicine</Text>
            <TextInput style={styles.input} placeholder="Medicine Name (e.g. Paracetamol)" value={newName} onChangeText={setNewName} />
            <TextInput style={styles.input} placeholder="Dosage (e.g. 500mg, 1 tablet)" value={newDosage} onChangeText={setNewDosage} />
            <TextInput style={styles.input} placeholder="Time (e.g. 08:00 AM)" value={newTime} onChangeText={setNewTime} />
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowAdd(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleAdd}>
                <Text style={styles.saveText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 25, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2D3436' },
  subtitle: { fontSize: 14, color: '#636E72', marginTop: 4 },
  addBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#0083B0', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  progressContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 25, paddingVertical: 15 },
  progressBar: { flex: 1, height: 8, backgroundColor: '#E0E0E0', borderRadius: 4 },
  progressFill: { height: 8, backgroundColor: '#10AC84', borderRadius: 4 },
  progressText: { marginLeft: 12, fontSize: 14, fontWeight: 'bold', color: '#10AC84' },
  list: { padding: 20 },
  medCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 12, elevation: 2 },
  medCardTaken: { opacity: 0.7 },
  checkBtn: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: '#ccc', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  checkBtnDone: { backgroundColor: '#10AC84', borderColor: '#10AC84' },
  medInfo: { flex: 1 },
  medName: { fontSize: 16, fontWeight: 'bold', color: '#2D3436' },
  medNameTaken: { textDecorationLine: 'line-through', color: '#999' },
  medDosage: { fontSize: 13, color: '#636E72', marginTop: 3 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 80 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#636E72', marginTop: 20 },
  emptySubtitle: { fontSize: 14, color: '#999', marginTop: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 30 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#2D3436', marginBottom: 20 },
  input: { backgroundColor: '#F0F2F5', borderRadius: 12, padding: 16, fontSize: 16, marginBottom: 15 },
  modalBtns: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  cancelBtn: { flex: 1, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#ccc', alignItems: 'center', marginRight: 10 },
  cancelText: { fontSize: 16, color: '#636E72' },
  saveBtn: { flex: 1, padding: 16, borderRadius: 12, backgroundColor: '#0083B0', alignItems: 'center', marginLeft: 10 },
  saveText: { fontSize: 16, color: '#fff', fontWeight: 'bold' },
});

export default MedicinesScreen;
