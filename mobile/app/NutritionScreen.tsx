import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '../hooks/useAppStore';

const { width: SW } = Dimensions.get('window');

export default function NutritionScreen() {
    const { meals, waterGlasses, addMeal, removeMeal, setWater } = useAppStore();
    const [showAdd, setShowAdd] = useState(false);
    const [mealName, setMealName] = useState('');
    const [mealCal, setMealCal] = useState('');
    const [mealProtein, setMealProtein] = useState('');
    const [mealCarbs, setMealCarbs] = useState('');
    const [mealFat, setMealFat] = useState('');
    const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');

    const today = new Date().toISOString().split('T')[0];
    const todayMeals = meals.filter(m => m.date === today);
    const totalCal = todayMeals.reduce((s, m) => s + m.calories, 0);
    const totalProtein = todayMeals.reduce((s, m) => s + m.protein, 0);
    const totalCarbs = todayMeals.reduce((s, m) => s + m.carbs, 0);
    const totalFat = todayMeals.reduce((s, m) => s + m.fat, 0);

    const handleAddMeal = () => {
        if (!mealName.trim()) return Alert.alert('Error', 'Enter meal name');
        addMeal({
            name: mealName, calories: parseInt(mealCal) || 0, protein: parseInt(mealProtein) || 0,
            carbs: parseInt(mealCarbs) || 0, fat: parseInt(mealFat) || 0, date: today, mealType,
        });
        setMealName(''); setMealCal(''); setMealProtein(''); setMealCarbs(''); setMealFat('');
        setShowAdd(false);
    };

    const mealTypes = [
        { key: 'breakfast', label: '🌅 Breakfast', color: '#FFA502' },
        { key: 'lunch', label: '☀️ Lunch', color: '#10AC84' },
        { key: 'dinner', label: '🌙 Dinner', color: '#6C63FF' },
        { key: 'snack', label: '🍿 Snack', color: '#00B4DB' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <LinearGradient colors={['#10AC84', '#1DD1A1']} style={styles.header}>
                    <Text style={styles.title}>🥗 Nutrition Tracker</Text>
                    <Text style={styles.subtitle}>Log your meals, track your nutrition</Text>
                </LinearGradient>

                {/* Daily Summary */}
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>Today's Intake</Text>
                    <View style={styles.summaryRow}>
                        <View style={styles.summaryItem}>
                            <Text style={[styles.summaryVal, { color: '#FF4757' }]}>{totalCal}</Text>
                            <Text style={styles.summaryLabel}>Calories</Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Text style={[styles.summaryVal, { color: '#6C63FF' }]}>{totalProtein}g</Text>
                            <Text style={styles.summaryLabel}>Protein</Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Text style={[styles.summaryVal, { color: '#FFA502' }]}>{totalCarbs}g</Text>
                            <Text style={styles.summaryLabel}>Carbs</Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Text style={[styles.summaryVal, { color: '#10AC84' }]}>{totalFat}g</Text>
                            <Text style={styles.summaryLabel}>Fat</Text>
                        </View>
                    </View>
                </View>

                {/* Hydration */}
                <View style={styles.hydrationCard}>
                    <View style={styles.hydrationHeader}>
                        <Ionicons name="water" size={24} color="#00B4DB" />
                        <Text style={styles.hydrationTitle}>Hydration</Text>
                        <Text style={styles.hydrationCount}>{waterGlasses}/8 glasses</Text>
                    </View>
                    <View style={styles.hydrationRow}>
                        <TouchableOpacity style={styles.waterBtn} onPress={() => setWater(Math.max(0, waterGlasses - 1))}>
                            <Ionicons name="remove" size={22} color="#00B4DB" />
                        </TouchableOpacity>
                        <View style={styles.waterBar}>
                            <View style={[styles.waterFill, { width: `${Math.min(100, (waterGlasses / 8) * 100)}%` }]} />
                        </View>
                        <TouchableOpacity style={styles.waterBtn} onPress={() => setWater(Math.min(15, waterGlasses + 1))}>
                            <Ionicons name="add" size={22} color="#00B4DB" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Meals by type */}
                {mealTypes.map(mt => {
                    const typeMeals = todayMeals.filter(m => m.mealType === mt.key);
                    return (
                        <View key={mt.key} style={styles.mealSection}>
                            <Text style={[styles.mealTypeTitle, { color: mt.color }]}>{mt.label}</Text>
                            {typeMeals.length === 0 ? (
                                <Text style={styles.noMeals}>No {mt.key} logged yet</Text>
                            ) : (
                                typeMeals.map(m => (
                                    <View key={m.id} style={styles.mealCard}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.mealName}>{m.name}</Text>
                                            <Text style={styles.mealNutrients}>{m.calories} cal • {m.protein}g P • {m.carbs}g C • {m.fat}g F</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => removeMeal(m.id)}>
                                            <Ionicons name="close-circle" size={22} color="#FF4757" />
                                        </TouchableOpacity>
                                    </View>
                                ))
                            )}
                        </View>
                    );
                })}

                {/* History */}
                {meals.filter(m => m.date !== today).length > 0 && (
                    <View style={styles.historySection}>
                        <Text style={styles.historyTitle}>📅 Previous Days</Text>
                        {[...new Set(meals.filter(m => m.date !== today).map(m => m.date))].sort().reverse().slice(0, 5).map(date => {
                            const dayMeals = meals.filter(m => m.date === date);
                            const dayCal = dayMeals.reduce((s, m) => s + m.calories, 0);
                            return (
                                <View key={date} style={styles.historyRow}>
                                    <Text style={styles.historyDate}>{date}</Text>
                                    <Text style={styles.historyCal}>{dayMeals.length} meals • {dayCal} cal</Text>
                                </View>
                            );
                        })}
                    </View>
                )}

                <View style={{ height: 80 }} />
            </ScrollView>

            {/* FAB */}
            <TouchableOpacity style={styles.fab} onPress={() => setShowAdd(true)}>
                <Ionicons name="add" size={30} color="#fff" />
            </TouchableOpacity>

            {/* Add Meal Modal */}
            <Modal visible={showAdd} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Log a Meal</Text>

                        {/* Meal type selector */}
                        <View style={styles.typeRow}>
                            {mealTypes.map(mt => (
                                <TouchableOpacity key={mt.key} style={[styles.typeChip, mealType === mt.key && { backgroundColor: mt.color }]} onPress={() => setMealType(mt.key as any)}>
                                    <Text style={[styles.typeText, mealType === mt.key && { color: '#fff' }]}>{mt.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TextInput style={styles.input} placeholder="Food name (e.g. Dal Chawal)" value={mealName} onChangeText={setMealName} />
                        <View style={styles.numRow}>
                            <TextInput style={[styles.input, styles.numInput]} placeholder="Calories" value={mealCal} onChangeText={setMealCal} keyboardType="numeric" />
                            <TextInput style={[styles.input, styles.numInput]} placeholder="Protein (g)" value={mealProtein} onChangeText={setMealProtein} keyboardType="numeric" />
                        </View>
                        <View style={styles.numRow}>
                            <TextInput style={[styles.input, styles.numInput]} placeholder="Carbs (g)" value={mealCarbs} onChangeText={setMealCarbs} keyboardType="numeric" />
                            <TextInput style={[styles.input, styles.numInput]} placeholder="Fat (g)" value={mealFat} onChangeText={setMealFat} keyboardType="numeric" />
                        </View>
                        <View style={styles.modalBtns}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowAdd(false)}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveBtn} onPress={handleAddMeal}>
                                <Text style={styles.saveText}>Log Meal</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: { padding: 30, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
    subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 5 },
    summaryCard: { marginHorizontal: 20, marginTop: -15, backgroundColor: '#fff', borderRadius: 20, padding: 20, elevation: 5 },
    summaryTitle: { fontSize: 16, fontWeight: 'bold', color: '#2D3436', marginBottom: 15 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
    summaryItem: { alignItems: 'center' },
    summaryVal: { fontSize: 22, fontWeight: 'bold' },
    summaryLabel: { fontSize: 12, color: '#636E72', marginTop: 3 },
    hydrationCard: { marginHorizontal: 20, marginTop: 20, backgroundColor: '#E1F5FE', borderRadius: 16, padding: 20 },
    hydrationHeader: { flexDirection: 'row', alignItems: 'center' },
    hydrationTitle: { fontSize: 16, fontWeight: 'bold', color: '#2D3436', flex: 1, marginLeft: 10 },
    hydrationCount: { fontSize: 14, color: '#00B4DB', fontWeight: 'bold' },
    hydrationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
    waterBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
    waterBar: { flex: 1, height: 10, backgroundColor: '#B3E5FC', borderRadius: 5, marginHorizontal: 12 },
    waterFill: { height: 10, backgroundColor: '#00B4DB', borderRadius: 5 },
    mealSection: { marginHorizontal: 20, marginTop: 20 },
    mealTypeTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
    noMeals: { fontSize: 13, color: '#999', fontStyle: 'italic', marginBottom: 5 },
    mealCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 8, elevation: 1 },
    mealName: { fontSize: 15, fontWeight: 'bold', color: '#2D3436' },
    mealNutrients: { fontSize: 12, color: '#636E72', marginTop: 3 },
    historySection: { marginHorizontal: 20, marginTop: 25 },
    historyTitle: { fontSize: 16, fontWeight: 'bold', color: '#2D3436', marginBottom: 12 },
    historyRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    historyDate: { fontSize: 14, color: '#2D3436' },
    historyCal: { fontSize: 13, color: '#636E72' },
    fab: { position: 'absolute', bottom: 25, right: 25, width: 60, height: 60, borderRadius: 30, backgroundColor: '#10AC84', justifyContent: 'center', alignItems: 'center', elevation: 8 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 25 },
    modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#2D3436', marginBottom: 15 },
    typeRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 },
    typeChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: '#F0F2F5', marginRight: 8, marginBottom: 8 },
    typeText: { fontSize: 13, color: '#636E72', fontWeight: '600' },
    input: { backgroundColor: '#F0F2F5', borderRadius: 12, padding: 16, fontSize: 16, marginBottom: 12 },
    numRow: { flexDirection: 'row' },
    numInput: { flex: 1, marginRight: 8 },
    modalBtns: { flexDirection: 'row', marginTop: 5 },
    cancelBtn: { flex: 1, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#ccc', alignItems: 'center', marginRight: 8 },
    cancelText: { fontSize: 16, color: '#636E72' },
    saveBtn: { flex: 1, padding: 16, borderRadius: 12, backgroundColor: '#10AC84', alignItems: 'center', marginLeft: 8 },
    saveText: { fontSize: 16, color: '#fff', fontWeight: 'bold' },
});
