import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const schemes = [
  {
    id: '1',
    name: 'Ayushman Bharat (PM-JAY)',
    desc: 'World\'s largest health assurance scheme providing ₹5 Lakh per family per year.',
    link: 'https://nha.gov.in/PM-JAY',
    icon: 'shield-plus'
  },
  {
    id: '2',
    name: 'Jan Aushadhi Scheme',
    desc: 'Making quality generic medicines available at affordable prices for all.',
    link: 'http://janaushadhi.gov.in/',
    icon: 'pill'
  },
  {
    id: '3',
    name: 'National Health Mission',
    desc: 'Support to State/UTs for strengthening their healthcare systems.',
    link: 'https://nhm.gov.in/',
    icon: 'hospital-building'
  },
  {
    id: '4',
    name: 'ABHA (Health ID)',
    desc: 'Create your digital health ID to access and share health records digitally.',
    link: 'https://healthid.ndhm.gov.in/',
    icon: 'card-account-details-outline'
  }
];

const GovtSchemesScreen = () => {
  const renderItem = ({ item }: { item: typeof schemes[0] }) => (
    <TouchableOpacity style={styles.card} onPress={() => Linking.openURL(item.link)}>
      <View style={styles.iconBox}>
        <MaterialCommunityIcons name={item.icon as any} size={30} color="#0083B0" />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.desc}>{item.desc}</Text>
        <View style={styles.learnMore}>
          <Text style={styles.linkText}>Learn More</Text>
          <Ionicons name="arrow-forward" size={16} color="#0083B0" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Govt Health Schemes</Text>
        <Text style={styles.subtitle}>Direct access to Indian medical initiatives</Text>
      </View>
      <FlatList
        data={schemes}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { padding: 25, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#2D3436' },
  subtitle: { fontSize: 14, color: '#636E72', marginTop: 5 },
  list: { padding: 20 },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 20, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 10 },
  iconBox: { width: 60, height: 60, borderRadius: 15, backgroundColor: '#E1F5FE', justifyContent: 'center', alignItems: 'center', marginRight: 20 },
  info: { flex: 1 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#2D3436' },
  desc: { fontSize: 14, color: '#636E72', marginVertical: 8, lineHeight: 20 },
  learnMore: { flexDirection: 'row', alignItems: 'center' },
  linkText: { fontSize: 13, color: '#0083B0', fontWeight: 'bold', marginRight: 5 },
});

export default GovtSchemesScreen;

