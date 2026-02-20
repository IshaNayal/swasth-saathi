import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useAppStore } from '../hooks/useAppStore';

export default function MyRecordsScreen() {
  const { healthRecords, addHealthRecord, removeHealthRecord } = useAppStore();
  const [uploading, setUploading] = useState(false);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        uploadFile(file);
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const uploadFile = async (file: DocumentPicker.DocumentPickerAsset) => {
    setUploading(true);
    // Simulate upload and AI processing
    setTimeout(() => {
      addHealthRecord({
        name: file.name,
        type: file.mimeType || 'Document',
        date: new Date().toISOString().split('T')[0],
        uri: file.uri
      });
      setUploading(false);
      Alert.alert('Success ✅', 'Report uploaded successfully! AI is analyzing the values.');
    }, 1500);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Record', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeHealthRecord(id) }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>📂 Digital Locker</Text>
          <Text style={styles.subtitle}>Securely store & analyze reports</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={pickDocument} disabled={uploading}>
          {uploading ? <ActivityIndicator color="#fff" /> : <Ionicons name="add" size={30} color="#fff" />}
        </TouchableOpacity>
      </View>

      {healthRecords.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="folder-upload-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>No medical reports yet</Text>
          <Text style={styles.emptySub}>Upload lab reports (PDF/IMG) for AI analysis.</Text>
          <TouchableOpacity style={styles.uploadBtn} onPress={pickDocument}>
            <Text style={styles.uploadText}>Upload Now</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={healthRecords}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.recordItem}>
              <View style={styles.recordIcon}>
                <Ionicons name={item.type?.includes('pdf') ? 'document-text' : 'image'} size={24} color="#0083B0" />
              </View>
              <View style={styles.recordInfo}>
                <Text style={styles.recordName}>{item.name}</Text>
                <Text style={styles.recordDate}>{item.date}</Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => Alert.alert('AI Analysis', 'Extracting vitals... \n(This would show parsed data)')} style={{ marginRight: 15 }}>
                  <Ionicons name="analytics" size={22} color="#6C63FF" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Ionicons name="trash-outline" size={22} color="#FF4757" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 25, backgroundColor: '#fff', borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 2 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2D3436' },
  subtitle: { fontSize: 13, color: '#636E72', marginTop: 4 },
  addBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#0083B0', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  list: { padding: 20 },
  recordItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 18, borderRadius: 16, marginBottom: 15, elevation: 2 },
  recordIcon: { width: 45, height: 45, borderRadius: 12, backgroundColor: '#E1F5FE', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  recordInfo: { flex: 1 },
  recordName: { fontSize: 15, fontWeight: 'bold', color: '#2D3436' },
  recordDate: { fontSize: 12, color: '#636E72', marginTop: 3 },
  actions: { flexDirection: 'row' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, marginTop: -50 },
  emptyText: { fontSize: 20, fontWeight: 'bold', color: '#636E72', marginTop: 20 },
  emptySub: { fontSize: 14, color: '#999', textAlign: 'center', marginTop: 10, lineHeight: 20 },
  uploadBtn: { marginTop: 25, backgroundColor: '#0083B0', paddingHorizontal: 25, paddingVertical: 14, borderRadius: 12, elevation: 3 },
  uploadText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
