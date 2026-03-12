import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Expense } from '../types';

interface ExpenseContextType {
    expenses: Expense[];
    addExpense: (expense: Omit<Expense, 'id' | 'date'>) => void;
    deleteExpense: (id: string) => void;
    totalAmount: number;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [expenses, setExpenses] = useState<Expense[]>([]);

    const addExpense = (expenseData: Omit<Expense, 'id' | 'date'>) => {
        const newExpense: Expense = {
            ...expenseData,
            id: Math.random().toString(36).substring(7),
            date: new Date().toISOString(),
        };
        setExpenses((prev) => [newExpense, ...prev]);
    };

    const deleteExpense = (id: string) => {
        setExpenses(prev => prev.filter(e => e.id !== id));
    };

    const totalAmount = expenses.reduce((sum, item) => sum + item.amount, 0);

    return (
        <ExpenseContext.Provider value={{ expenses, addExpense, deleteExpense, totalAmount }}>
            {children}
        </ExpenseContext.Provider>
    );
};

export const useExpenses = () => {
    const context = useContext(ExpenseContext);
    if (!context) {
        throw new Error('useExpenses must be used within an ExpenseProvider');
    }
    return context;
};
