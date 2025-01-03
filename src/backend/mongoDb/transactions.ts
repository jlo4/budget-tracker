"use server";

import { Transaction } from "@/lib/types/Transaction";
import { getClient } from "./client";
import config from "@/config";

const insertTransactions = async (transactions: Transaction[]) => {
    try {
        const client = await getClient();
        const db = client.db(config.mongoDbName);
        const collection = db.collection("transactions");
        const transactionsWithISODate = transactions.map((transaction) => {
            // TODO: Should check date format
            const [year, month, day] = transaction.date.split("-").map(Number)
            return {
                ...transaction,
                date: new Date(year, month - 1, day)
            }
        });
        const result = await collection.insertMany(transactionsWithISODate);
        return result.acknowledged ? result.insertedCount : 0;
    } catch (error) {
        console.error("Error inserting transactions", error);
    }
};

const fetchTransactions = async () => {
    try {
        const client = await getClient();
        const db = client.db(config.mongoDbName);
        const collection = db.collection("transactions");
        const result = await collection.find<Transaction>({}, { projection: { _id: 0 }}).sort({ date: -1 }).toArray();
        return result;
    } catch (error) {
        console.error("Error fetching transactions", error);
    }
};

export {
    fetchTransactions,
    insertTransactions
}