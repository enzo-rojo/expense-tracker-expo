import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useExpenses } from '../context/ExpenseContext';
import { CATEGORIES, ExpenseCategory } from '../types';

const CATEGORY_ICONS: Record<ExpenseCategory, any> = {
    'Food': 'fast-food',
    'Transport': 'bus',
    'Shopping': 'cart',
    'Bills': 'receipt',
    'Entertainment': 'game-controller',
    'Other': 'ellipsis-horizontal'
};

const AddExpenseScreen = ({ navigation }: any) => {
    const { addExpense } = useExpenses();
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState<ExpenseCategory>(CATEGORIES[0]);

    const handleSave = () => {
        const numAmount = parseFloat(amount);
        if (!title.trim() || isNaN(numAmount) || numAmount <= 0) {
            Alert.alert('Error', 'Please provide a valid title and amount.');
            return;
        }

        addExpense({ title, amount: numAmount, category });
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="#1c1c1e" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>New Expense</Text>
                <View style={{ width: 44 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.amountSection}>
                        <Text style={styles.amountLabel}>How much?</Text>
                        <View style={styles.amountInputContainer}>
                            <Text style={styles.currencySymbol}>$</Text>
                            <TextInput
                                style={styles.amountInput}
                                placeholder="0.00"
                                value={amount}
                                onChangeText={setAmount}
                                keyboardType="decimal-pad"
                                autoFocus
                                placeholderTextColor="rgba(28, 28, 30, 0.2)"
                            />
                        </View>
                    </View>

                    <View style={styles.formSection}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>For what?</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g., Dinner at the pier"
                                value={title}
                                onChangeText={setTitle}
                                placeholderTextColor="#C7C7CC"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Select Category</Text>
                            <View style={styles.categoryGrid}>
                                {CATEGORIES.map((cat) => (
                                    <TouchableOpacity
                                        key={cat}
                                        style={[
                                            styles.categoryCard,
                                            category === cat && styles.categoryCardSelected
                                        ]}
                                        onPress={() => setCategory(cat)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={[
                                            styles.categoryIconContainer,
                                            category === cat && styles.categoryIconContainerSelected
                                        ]}>
                                            <Ionicons
                                                name={CATEGORY_ICONS[cat]}
                                                size={22}
                                                color={category === cat ? '#fff' : '#007AFF'}
                                            />
                                        </View>
                                        <Text style={[
                                            styles.categoryLabel,
                                            category === cat && styles.categoryLabelSelected
                                        ]}>{cat}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.8}>
                            <Text style={styles.saveButtonText}>Track Expense</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        height: 56,
    },
    closeButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1c1c1e',
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    amountSection: {
        alignItems: 'center',
        marginVertical: 32,
    },
    amountLabel: {
        fontSize: 14,
        color: '#8e8e93',
        fontWeight: '600',
        marginBottom: 8,
    },
    amountInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    currencySymbol: {
        fontSize: 32,
        fontWeight: '700',
        color: '#1c1c1e',
        marginRight: 4,
    },
    amountInput: {
        fontSize: 48,
        fontWeight: '800',
        color: '#1c1c1e',
        minWidth: 100,
    },
    formSection: {
        gap: 24,
    },
    inputGroup: {
        gap: 12,
    },
    label: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1c1c1e',
    },
    input: {
        backgroundColor: '#F2F2F7',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#1c1c1e',
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    categoryCard: {
        width: '30%',
        backgroundColor: '#F2F2F7',
        borderRadius: 16,
        padding: 12,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    categoryCardSelected: {
        borderColor: '#007AFF',
        backgroundColor: 'rgba(0, 122, 255, 0.05)',
    },
    categoryIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(0, 122, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    categoryIconContainerSelected: {
        backgroundColor: '#007AFF',
    },
    categoryLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#8e8e93',
    },
    categoryLabelSelected: {
        color: '#007AFF',
    },
    footer: {
        marginTop: 40,
    },
    saveButton: {
        backgroundColor: '#1c1c1e',
        borderRadius: 16,
        padding: 18,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default AddExpenseScreen;
