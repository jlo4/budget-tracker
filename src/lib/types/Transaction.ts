export interface Transaction {
    id?: string;
    type: "expense" | "income";
    amount: number;
    date: string;
    category?: string;
    description?: string;
    payee?: string;
}

type TransctionKeys = keyof Transaction;

export const transactionKeys: TransctionKeys[] = ["date", "payee", "amount", "category", "description", ];