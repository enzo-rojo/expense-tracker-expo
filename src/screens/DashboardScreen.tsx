import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { useExpenses } from '../context/ExpenseContext';
import { CATEGORIES, ExpenseCategory } from '../types';

const { width } = Dimensions.get('window');

// Category to Icon mapping
const CATEGORY_ICONS: Record<ExpenseCategory, any> = {
    'Food': 'fast-food',
    'Transport': 'bus',
    'Shopping': 'cart',
    'Bills': 'receipt',
    'Entertainment': 'game-controller',
    'Other': 'ellipsis-horizontal'
};

const DashboardScreen = ({ navigation }: any) => {
    const { expenses, deleteExpense } = useExpenses();
    const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | null>(null);

    const filteredExpenses = useMemo(() => {
        if (!selectedCategory) return expenses;
        return expenses.filter(e => e.category === selectedCategory);
    }, [expenses, selectedCategory]);

    const filteredTotal = useMemo(() => {
        return filteredExpenses.reduce((sum, item) => sum + item.amount, 0);
    }, [filteredExpenses]);

    const handleDelete = (id: string) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        deleteExpense(id);
    };

    const renderRightActions = (id: string) => {
        return (
            <TouchableOpacity
                style={styles.deleteAction}
                onPress={() => handleDelete(id)}
                activeOpacity={0.7}
            >
                <Ionicons name="trash-outline" size={24} color="#fff" />
                <Text style={styles.deleteActionText}>Delete</Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>
                        {selectedCategory ? `${selectedCategory} Balance` : 'Current Balance'}
                    </Text>
                    <Text style={styles.summaryValue}>${filteredTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                </View>

                <View style={styles.filterSection}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.filterScroll}
                    >
                        <TouchableOpacity
                            style={[
                                styles.filterChip,
                                !selectedCategory && styles.filterChipActive
                            ]}
                            onPress={() => setSelectedCategory(null)}
                            activeOpacity={0.7}
                        >
                            <Text style={[
                                styles.filterChipText,
                                !selectedCategory && styles.filterChipTextActive
                            ]}>All</Text>
                        </TouchableOpacity>

                        {CATEGORIES.map((cat) => (
                            <TouchableOpacity
                                key={cat}
                                style={[
                                    styles.filterChip,
                                    selectedCategory === cat && styles.filterChipActive
                                ]}
                                onPress={() => setSelectedCategory(cat)}
                                activeOpacity={0.7}
                            >
                                <Ionicons
                                    name={CATEGORY_ICONS[cat]}
                                    size={14}
                                    color={selectedCategory === cat ? '#fff' : '#8e8e93'}
                                    style={{ marginRight: 6 }}
                                />
                                <Text style={[
                                    styles.filterChipText,
                                    selectedCategory === cat && styles.filterChipTextActive
                                ]}>{cat}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>

            <FlatList
                data={filteredExpenses}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <Swipeable
                        renderRightActions={() => renderRightActions(item.id)}
                        friction={2}
                        rightThreshold={40}
                        overshootRight={false}
                        containerStyle={styles.swipeableContainer}
                    >
                        <View style={styles.expenseCard}>
                            <View style={styles.cardIconContainer}>
                                <Ionicons name={CATEGORY_ICONS[item.category as ExpenseCategory]} size={24} color="#007AFF" />
                            </View>
                            <View style={styles.cardInfo}>
                                <Text style={styles.expenseTitle}>{item.title}</Text>
                                <Text style={styles.dateText}>{new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</Text>
                            </View>
                            <View style={styles.amountContainer}>
                                <Text style={styles.expenseAmount}>-${item.amount.toFixed(2)}</Text>
                                <View style={styles.cardCategoryBadge}>
                                    <Text style={styles.cardCategoryText}>{item.category}</Text>
                                </View>
                            </View>
                        </View>
                    </Swipeable>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="card-outline" size={80} color="#D1D1D6" />
                        <Text style={styles.emptyText}>
                            {selectedCategory
                                ? `No transactions in ${selectedCategory}`
                                : 'Your transaction list is empty'}
                        </Text>
                    </View>
                }
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('AddExpense')}
                activeOpacity={0.9}
            >
                <Ionicons name="add" size={32} color="#fff" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
    },
    header: {
        backgroundColor: '#fff',
        paddingBottom: 20,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 5,
    },
    summaryCard: {
        margin: 20,
        padding: 24,
        backgroundColor: '#1c1c1e',
        borderRadius: 24,
        shadowColor: '#1c1c1e',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    summaryLabel: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.7)',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 8,
    },
    summaryValue: {
        fontSize: 34,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 16,
    },
    summaryInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    summaryInfoText: {
        fontSize: 12,
        color: '#fff',
        marginLeft: 6,
        fontWeight: '500',
    },
    filterSection: {
        marginTop: 8,
    },
    filterScroll: {
        paddingHorizontal: 20,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 18,
        backgroundColor: '#F2F2F7',
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    filterChipActive: {
        backgroundColor: '#1c1c1e',
    },
    filterChipText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#8e8e93',
    },
    filterChipTextActive: {
        color: '#fff',
    },
    listContainer: {
        padding: 20,
        paddingTop: 10,
        paddingBottom: 100,
    },
    swipeableContainer: {
        marginBottom: 16,
    },
    expenseCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
    },
    deleteAction: {
        backgroundColor: '#FF3B30',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: '80%',
        marginTop: '2%',
        borderRadius: 20,
        marginBottom: 16,
        marginLeft: 10,
    },
    deleteActionText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        marginTop: 4,
    },
    cardIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: 'rgba(0, 122, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    cardInfo: {
        flex: 1,
    },
    expenseTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1c1c1e',
        marginBottom: 4,
    },
    dateText: {
        fontSize: 12,
        color: '#8e8e93',
    },
    amountContainer: {
        alignItems: 'flex-end',
    },
    expenseAmount: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FF3B30',
        marginBottom: 4,
    },
    cardCategoryBadge: {
        backgroundColor: '#F2F2F7',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    cardCategoryText: {
        fontSize: 10,
        color: '#8e8e93',
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    emptyContainer: {
        marginTop: 60,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#8e8e93',
        marginTop: 16,
        fontWeight: '500',
        textAlign: 'center',
    },
    fab: {
        position: 'absolute',
        right: 24,
        bottom: 40,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#1c1c1e',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 5,
    },
});

export default DashboardScreen;
