"use server";

import { Transaction } from "@/lib/types/Transaction";

const parseTransactionFile = async (file: string | ArrayBuffer | undefined) => {        
    if (!file) {
        return [];
    }
    
    const transactions: Transaction[] = [];

    const csvFile = typeof file === "string" ? file : Buffer.from(file).toString();
    const csvFileLines = csvFile.split("\n");
    
    // TODO: These all expect header rows. Should allow uploading files without headers
    const headers = getHeadersFromQuotedCsvFile(csvFileLines[0].replace(/^"|"$/g, ""))[0];

    if (headers.split(",")[0] === "Reg. Dag") {
        const csvWithoutHeaders = csvFileLines.slice(1);

        const rows = getRowsFromQuotedCsvFile(csvWithoutHeaders);
        transactions.push(...rows);
    } else {
        const csvWithoutHeaders = csvFileLines.slice(1);
        const rows = getRowsFromCsvFile(csvWithoutHeaders);
        transactions.push(...rows);
    }

    return transactions;
}

const getHeadersFromQuotedCsvFile = (firstRow: string) => {
    const unquotedRow = firstRow.replace(/^"/g, "");
    const headers = [];
    let currentHeader = "";
    let insideQuotes = false;
    // The "Belopp, euro" header causes some problems, try to resolve that here
    for (let i = 0; i < unquotedRow.length; i++) {
        const char = unquotedRow[i];

        if (char === "\"") {
            insideQuotes = !insideQuotes;
        } else if (char === "," && !insideQuotes) {
            headers.push(currentHeader.trim());
            currentHeader = "";
        } else {
            currentHeader += char;
        }
    }

    if (currentHeader) {
        headers.push(currentHeader.trim());
    }
    return headers;
}

const getRowsFromQuotedCsvFile = (csvFile: string[]) => {
    const rows = [];

    for (const row of csvFile) {
        const values = row.replace(/^"|"$/g, "").split(",").filter(Boolean);
        if (values.length < 10) {
            continue;
        }
        const transaction = {
            date: values[1].replaceAll("/", "-") ?? "",
            payee: values[5] ?? "",
            amount: parseFloat(values[2] ?? 0),
            type: (parseFloat(values[2]) >= 0 ? "income" : "expense") as "income" | "expense",
            category: "",
            description: values[9] ?? "",
        };
        rows.push(transaction);
    }
    return rows;
};

const getRowsFromCsvFile = (csvFile: string[]) => {
    const rows = [];
    console.log("csvFile", csvFile);
    for (const row of csvFile) {
        console.log("row", row);
        if (row.length < 10) {
            continue;
        }
        const values = row.split(",");
        const transaction = {
            date: values[0].replaceAll("/", "-"),
            payee: values[1],
            amount: values[3] === "income" && parseFloat(values[2]) >= 0 ? parseFloat(values[2]) : values[3] === "expense" && parseFloat(values[2]) <= 0 ? parseFloat(values[2]) : -parseFloat(values[2]),
            type: ["income", "expense"].includes(values[3]) ? (values[3] as "income" | "expense") : (parseFloat(values[2]) >= 0 ? "income" : "expense"),
            category: "",
            description: values[9],
        };
        rows.push(transaction);
    }
    return rows;
}

/*
import { OPTransactionHeaders } from "@/lib/types/csvFileHeaders";
const getTranctionType = (row: { [OPTransactionHeaders.swedish.typeDescription]: string, [OPTransactionHeaders.swedish.amount]: number }): "income" | "expense" => {
    if (row[OPTransactionHeaders.swedish.typeDescription] === "KONTOGIRERING" && row[OPTransactionHeaders.swedish.amount] >= 0) {
        return "income";
    }
    return "expense";
};
const getRowsFromParsedCsvFile = (csvFile: any) => {
    const rows = [];
    for (const row of csvFile) {
        const transaction = {
            date: row[OPTransactionHeaders.swedish.completedDay].replaceAll("/", "-"),
            payee: row[OPTransactionHeaders.swedish.payee],
            amount: parseFloat(row[OPTransactionHeaders.swedish.amount]),
            type: getTranctionType(row),
            category: "",
            description: row[OPTransactionHeaders.swedish.description],
        };
        rows.push(transaction);
    }
    return rows;
}
*/

export {
    parseTransactionFile
}