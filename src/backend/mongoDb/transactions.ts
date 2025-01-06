"use server";

import { Transaction } from "@/lib/types/Transaction";
import { getClient, getCollection } from "./client";
import config from "@/config";

const insertTransactions = async (transactions: Transaction[], incomingDateFormat = "YYYY-MM-DD") => {
    try {        
        const collection = await getCollection("transactions");
        const transactionsWithISODate = transactions.map((transaction) => {
            // TODO: Should check date format
            let year = 0;
            let month = 0;
            let day = 0;
            if (incomingDateFormat === "DD-MM-YYYY") {
                [day, month, year] = transaction.date.split("-").map(Number)                
            } else if (incomingDateFormat === "YYYY-MM-DD") {
                [year, month, day] = transaction.date.split("-").map(Number)                
            }
            return {
                ...transaction,
                date: new Date(year, month - 1, day),
                amount: transaction.type === "expense" && transaction.amount <= 0 ? transaction.amount : -transaction.amount
            };
        });
        const result = await collection?.insertMany(transactionsWithISODate);
        if (!result) {
            console.error("Error inserting transactions", result);
            return 0;
        }
        return result.acknowledged ? result.insertedCount : 0;
    } catch (error) {
        console.error("Error inserting transactions", error);
    }
};

const fetchTransactions = async () => {
    const mongoClient = await getClient();
    try {
        await mongoClient.connect();
        const db = mongoClient.db(config.mongoDbName);
        const collection = db.collection("transactions");
        const result = await collection?.find<Transaction>({}, { projection: { _id: 0 }}).sort({ date: -1 }).toArray();
        return result;
    } catch (error) {
        console.error("Error fetching transactions", error);
        return [];
    } finally {
        await mongoClient.close();
    }
};

export {
    fetchTransactions,
    insertTransactions
}