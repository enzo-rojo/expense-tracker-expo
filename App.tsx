import { registerRootComponent } from 'expo';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ExpenseProvider } from './src/context/ExpenseContext';
import DashboardScreen from './src/screens/DashboardScreen';
import AddExpenseScreen from './src/screens/AddExpenseScreen';

const Stack = createNativeStackNavigator();

function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <ExpenseProvider>
                    <NavigationContainer>
                        <Stack.Navigator
                            screenOptions={{
                                headerTitleStyle: { fontWeight: '600' },
                                animation: 'slide_from_right',
                            }}
                        >
                            <Stack.Screen
                                name="Dashboard"
                                component={DashboardScreen}
                                options={{ title: 'Expense Tracker' }}
                            />
                            <Stack.Screen
                                name="AddExpense"
                                component={AddExpenseScreen}
                                options={{
                                    title: 'New Expense',
                                    presentation: 'modal'
                                }}
                            />
                        </Stack.Navigator >
                    </NavigationContainer>
                </ExpenseProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}

registerRootComponent(App);
