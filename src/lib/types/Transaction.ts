export interface Transaction {
    id?: string;
    type: "expense" | "income";
    amount: number;
    date: string;
    category?: string;
    description?: string;
    payee?: string;
}