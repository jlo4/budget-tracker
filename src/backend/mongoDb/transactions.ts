"use server";

import { Transaction } from "@/lib/types/Transaction";
import { getCollection } from "./client";

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
                amount: transaction.type === "income" && transaction.amount >= 0 ? transaction.amount : transaction.type === "expense" && transaction.amount <= 0 ? transaction.amount : -transaction.amount
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
    try {
        const collection = await getCollection("transactions");
        const result = await collection?.find<Transaction>({}, { projection: { _id: 0 }}).sort({ date: -1 }).toArray();
        return result;
    } catch (error) {
        console.error("Error fetching transactions", error);
        return [];
    }
};

const sumTransactionsByMonth = async () => {
    try {
        const collection = await getCollection("transactions");
        const result = await collection?.aggregate([
            {
                $addFields: {
                  yearMonth: { 
                    $dateToString: { format: "%Y-%m", date: "$date" } 
                  }
                }
              },
              {
                $group: {
                  _id: "$yearMonth",
                  totalAmount: { $sum: "$amount" }
                }
              },
              {
                $project: {
                  _id: 1,
                  totalAmount: { $round: ["$totalAmount", 2] }
                }
              },
              {
                $sort: { _id: 1 }
              }
        ]).toArray();
        return result;
    } catch (error) {
        console.error("Error fetching transactions", error);
    }
};

const getTransactionsByMonth = async (currMonth: string, nextMonth: string) => {  
    try {
        const collection = await getCollection("transactions");
        const result = await collection?.aggregate([
            {
                $addFields: {
                  currMonth: {
                    $dateToString: { format: "%Y-%m", date: "$date" }
                  }
                }
            },
            { 
                $match: {
                    date: { $gte: new Date(`${currMonth}-01`), $lt: new Date(`${nextMonth}-01`) }
                }
            },
              {
                $group: {
                  _id: "$yearMonth",
                  currMonth: { $first: "$currMonth" },
                  totalExpenses: {
                    $sum: {
                      $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0]
                    }
                  },
                  totalIncome: {
                    $sum: {
                      $cond: [{ $eq: ["$type", "income"] }, "$amount", 0]
                    }
                  }
                }
              },
              {
                $sort: { _id: 1 }
              }
        ]).toArray();
        return result;
    } catch (error) {
        console.error("Error fetching transactions", error);
    }
};

export {
    fetchTransactions,
    getTransactionsByMonth,
    insertTransactions,
    sumTransactionsByMonth,
}