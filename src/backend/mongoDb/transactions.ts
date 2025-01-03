"use server";

import { Transaction } from "@/lib/types/Transaction";
import { getClient } from "./client";
import config from "@/config";

const insertTransactions = async (transactions: Transaction[]) => {
    try {
        const client = await getClient();
        const db = client.db(config.mongoDbName);
        const collection = db.collection("transactions");        
        const result = await collection.insertMany(transactions);
        return result.acknowledged ? result.insertedCount : 0;
    } catch (error) {
        console.error("Error inserting transactions", error);
    }
}

const fetchTransactions = async () => {
    try {
        const client = await getClient();
        const db = client.db(config.mongoDbName);
        const collection = db.collection("transactions");
        const result = await collection.find<Transaction>({}, { projection: { _id: 0 }}).toArray();
        return result;
    } catch (error) {
        console.error("Error fetching transactions", error);
    }
}

export {
    fetchTransactions,
    insertTransactions
}