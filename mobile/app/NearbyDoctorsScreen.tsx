import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '../hooks/useAppStore';

const doctorsData = [
    {
        id: '1', name: 'Dr. Anita Sharma', specialty: 'General Physician',
        hospital: 'Apollo Clinic', distance: '0.8 km', rating: 4.8, reviews: 234,
        timing: '9:00 AM - 5:00 PM', fee: '₹300', available: true,
        phone: '+919876543210', languages: ['Hindi', 'English'],
    },
    {
        id: '2', name: 'Dr. Rajesh Kumar', specialty: 'Cardiologist',
        hospital: 'Max Hospital', distance: '1.2 km', rating: 4.9, reviews: 512,
        timing: '10:00 AM - 6:00 PM', fee: '₹800', available: true,
        phone: '+919876543211', languages: ['Hindi', 'English', 'Punjabi'],
    },
    {
        id: '3', name: 'Dr. Priya Patel', specialty: 'Dermatologist',
        hospital: 'Fortis Hospital', distance: '2.5 km', rating: 4.7, reviews: 189,
        timing: '11:00 AM - 7:00 PM', fee: '₹500', available: false,
        phone: '+919876543212', languages: ['Hindi', 'English', 'Gujarati'],
    },
    {
        id: '4', name: 'Dr. Suresh Menon', specialty: 'Orthopedic',
        hospital: 'AIIMS Clinic', distance: '3.1 km', rating: 4.6, reviews: 320,
        timing: '8:00 AM - 2:00 PM', fee: '₹400', available: true,
        phone: '+919876543213', languages: ['Hindi', 'English', 'Malayalam'],
    },
    {
        id: '5', name: 'Dr. Fatima Khan', specialty: 'Pediatrician',
        hospital: 'Rainbow Children\'s', distance: '1.8 km', rating: 4.9, reviews: 456,
        timing: '9:00 AM - 4:00 PM', fee: '₹350', available: true,
        phone: '+919876543214', languages: ['Hindi', 'English', 'Urdu'],
    },
    {
        id: '6', name: 'Dr. Arun Nair', specialty: 'ENT Specialist',
        hospital: 'Medanta Clinic', distance: '4.2 km', rating: 4.5, reviews: 145,
        timing: '10:00 AM - 5:00 PM', fee: '₹600', available: true,
        phone: '+919876543215', languages: ['Hindi', 'English', 'Tamil'],
    },
    {
        id: '7', name: 'Dr. Meera Reddy', specialty: 'Gynecologist',
        hospital: 'Cloudnine Hospital', distance: '2.0 km', rating: 4.8, reviews: 387,
        timing: '9:30 AM - 6:30 PM', fee: '₹700', available: false,
        phone: '+919876543216', languages: ['Hindi', 'English', 'Telugu'],
    },
];

const specialties = ['All', 'General', 'Cardiology', 'Dermatology', 'Orthopedic', 'Pediatrics', 'ENT', 'Gynecology'];

export default function NearbyDoctorsScreen() {
    const { addBooking } = useAppStore();
    const [search, setSearch] = useState('');
    const [selectedSpec, setSelectedSpec] = useState('All');
    const [showAvailableOnly, setShowAvailableOnly] = useState(false);

    const filteredDoctors = doctorsData.filter(d => {
        const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase());
        const matchesSpec = selectedSpec === 'All' || d.specialty.toLowerCase().includes(selectedSpec.toLowerCase());
        const matchesAvail = !showAvailableOnly || d.available;
        return matchesSearch && matchesSpec && matchesAvail;
    });

    const handleBook = (doc: typeof doctorsData[0]) => {
        if (!doc.available) {
            Alert.alert('Not Available', 'This doctor is currently not available. Try another time slot.');
            return;
        }

        Alert.alert(
            'Confirm Booking',
            `Book appointment with ${doc.name}?\nFee: ${doc.fee}`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Confirm',
                    onPress: () => {
                        addBooking({
                            doctorName: doc.name,
                            specialty: doc.specialty,
                            hospital: doc.hospital,
                            date: new Date().toISOString().split('T')[0], // Default to today for now
                            status: 'upcoming'
                        });
                        Alert.alert('Success ✅', `Appointment booked for ${doc.name}. Check Profile/Bookings.`);
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <LinearGradient colors={['#10AC84', '#1DD1A1']} style={styles.header}>
                    <Text style={styles.title}>🏥 Nearby Doctors</Text>
                    <Text style={styles.subtitle}>Find verified doctors near your location</Text>
                    <View style={styles.locationRow}>
                        <Ionicons name="location" size={16} color="#fff" />
                        <Text style={styles.locationText}>📍 Detecting your location...</Text>
                    </View>
                </LinearGradient>

                {/* Search */}
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#999" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search doctor name or specialty..."
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>

                {/* Filter Chips */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 10 }}>
                    {specialties.map(spec => (
                        <TouchableOpacity
                            key={spec}
                            style={[styles.filterChip, selectedSpec === spec && styles.filterChipActive]}
                            onPress={() => setSelectedSpec(spec)}
                        >
                            <Text style={[styles.filterText, selectedSpec === spec && styles.filterTextActive]}>{spec}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Available Toggle */}
                <TouchableOpacity
                    style={styles.toggleRow}
                    onPress={() => setShowAvailableOnly(!showAvailableOnly)}
                >
                    <Ionicons name={showAvailableOnly ? 'checkbox' : 'square-outline'} size={22} color="#10AC84" />
                    <Text style={styles.toggleText}>Show available now only</Text>
                </TouchableOpacity>

                <Text style={styles.resultCount}>{filteredDoctors.length} doctors found near you</Text>

                {/* Doctor List */}
                {filteredDoctors.map(doc => (
                    <View key={doc.id} style={styles.doctorCard}>
                        <View style={styles.doctorTop}>
                            <View style={[styles.avatar, { backgroundColor: doc.available ? '#10AC84' : '#ccc' }]}>
                                <FontAwesome5 name="user-md" size={24} color="#fff" />
                            </View>
                            <View style={styles.doctorInfo}>
                                <View style={styles.nameRow}>
                                    <Text style={styles.doctorName}>{doc.name}</Text>
                                    {doc.available && <View style={styles.onlineDot} />}
                                </View>
                                <Text style={styles.specialty}>{doc.specialty}</Text>
                                <Text style={styles.hospital}>{doc.hospital}</Text>
                            </View>
                        </View>

                        <View style={styles.statsRow}>
                            <View style={styles.stat}>
                                <Ionicons name="star" size={14} color="#FFA502" />
                                <Text style={styles.statText}>{doc.rating} ({doc.reviews})</Text>
                            </View>
                            <View style={styles.stat}>
                                <Ionicons name="location-outline" size={14} color="#636E72" />
                                <Text style={styles.statText}>{doc.distance}</Text>
                            </View>
                            <View style={styles.stat}>
                                <Ionicons name="time-outline" size={14} color="#636E72" />
                                <Text style={styles.statText}>{doc.timing}</Text>
                            </View>
                        </View>

                        <View style={styles.langRow}>
                            <Ionicons name="globe-outline" size={14} color="#999" />
                            <Text style={styles.langText}>{doc.languages.join(', ')}</Text>
                        </View>

                        <View style={styles.bottomRow}>
                            <Text style={styles.fee}>{doc.fee}</Text>
                            <View style={styles.actionRow}>
                                <TouchableOpacity style={styles.callBtn} onPress={() => Linking.openURL(`tel:${doc.phone}`)}>
                                    <Ionicons name="call" size={18} color="#fff" />
                                    <Text style={styles.callText}>Call</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.bookBtn, !doc.available && styles.bookBtnDisabled]}
                                    onPress={() => handleBook(doc)}
                                >
                                    <Text style={styles.bookText}>{doc.available ? 'Book Now' : 'Unavailable'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}

                {filteredDoctors.length === 0 && (
                    <View style={styles.emptyState}>
                        <MaterialCommunityIcons name="doctor" size={70} color="#ccc" />
                        <Text style={styles.emptyTitle}>No doctors found</Text>
                        <Text style={styles.emptySubtitle}>Try changing your search or filters</Text>
                    </View>
                )}

                {/* Camps */}
                <Text style={styles.sectionTitle}>🏕️ Nearby Free Health Camps</Text>
                {[
                    { name: 'Ayushman Health Camp', location: 'Community Hall, Sector 15', date: 'Feb 25, 2026', services: 'BP, Sugar, Eye Test' },
                    { name: 'Jan Aushadhi Medical Camp', location: 'Govt School Ground, MG Road', date: 'Mar 2, 2026', services: 'Free Medicines, Dental, X-Ray' },
                    { name: 'Red Cross Blood Camp', location: 'District Hospital', date: 'Mar 10, 2026', services: 'Blood Donation, Free Checkup' },
                ].map((camp, i) => (
                    <View key={i} style={styles.campCard}>
                        <View style={styles.campIcon}>
                            <MaterialCommunityIcons name="hospital-building" size={28} color="#10AC84" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.campName}>{camp.name}</Text>
                            <Text style={styles.campLocation}>📍 {camp.location}</Text>
                            <Text style={styles.campDate}>📅 {camp.date}</Text>
                            <Text style={styles.campServices}>🩺 {camp.services}</Text>
                        </View>
                    </View>
                ))}

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
    locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, alignSelf: 'flex-start' },
    locationText: { color: '#fff', fontSize: 13, marginLeft: 5 },
    searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 20, marginTop: -20, borderRadius: 16, paddingHorizontal: 18, paddingVertical: 14, elevation: 5 },
    searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
    filterScroll: { marginTop: 15 },
    filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', marginHorizontal: 5, elevation: 1 },
    filterChipActive: { backgroundColor: '#10AC84' },
    filterText: { fontSize: 13, color: '#636E72' },
    filterTextActive: { color: '#fff', fontWeight: 'bold' },
    toggleRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginTop: 15 },
    toggleText: { fontSize: 14, color: '#636E72', marginLeft: 10 },
    resultCount: { fontSize: 13, color: '#999', marginHorizontal: 20, marginTop: 10, marginBottom: 10 },
    doctorCard: { backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 20, padding: 18, marginBottom: 15, elevation: 2 },
    doctorTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    avatar: { width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    doctorInfo: { flex: 1 },
    nameRow: { flexDirection: 'row', alignItems: 'center' },
    doctorName: { fontSize: 16, fontWeight: 'bold', color: '#2D3436' },
    onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10AC84', marginLeft: 8 },
    specialty: { fontSize: 13, color: '#00B4DB', marginTop: 2, fontWeight: '600' },
    hospital: { fontSize: 12, color: '#636E72', marginTop: 2 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#f0f0f0', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    stat: { flexDirection: 'row', alignItems: 'center' },
    statText: { fontSize: 12, color: '#636E72', marginLeft: 5 },
    langRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
    langText: { fontSize: 12, color: '#999', marginLeft: 6 },
    bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
    fee: { fontSize: 18, fontWeight: 'bold', color: '#2D3436' },
    actionRow: { flexDirection: 'row' },
    callBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#10AC84', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, marginRight: 10 },
    callText: { color: '#fff', fontWeight: 'bold', marginLeft: 6, fontSize: 13 },
    bookBtn: { backgroundColor: '#0083B0', paddingHorizontal: 18, paddingVertical: 8, borderRadius: 10 },
    bookBtnDisabled: { backgroundColor: '#ccc' },
    bookText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
    emptyState: { alignItems: 'center', paddingVertical: 50 },
    emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#636E72', marginTop: 15 },
    emptySubtitle: { fontSize: 14, color: '#999', marginTop: 5 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2D3436', marginHorizontal: 20, marginTop: 25, marginBottom: 15 },
    campCard: { flexDirection: 'row', backgroundColor: '#E8F8F5', marginHorizontal: 20, borderRadius: 16, padding: 18, marginBottom: 12 },
    campIcon: { width: 50, height: 50, borderRadius: 15, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    campName: { fontSize: 15, fontWeight: 'bold', color: '#2D3436' },
    campLocation: { fontSize: 13, color: '#636E72', marginTop: 4 },
    campDate: { fontSize: 13, color: '#636E72', marginTop: 2 },
    campServices: { fontSize: 13, color: '#10AC84', marginTop: 2, fontWeight: '600' },
});
