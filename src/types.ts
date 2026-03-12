export interface Expense {
    id: string;
    title: string;
    category: string;
    amount: number;
    date: string;
}

export type ExpenseCategory = 'Food' | 'Transport' | 'Shopping' | 'Bills' | 'Entertainment' | 'Other';

export const CATEGORIES: ExpenseCategory[] = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Other'];
