import { Transaction } from "@/lib/types/Transaction";

const convertRowDataToTransactions = (rowData: RowData[]): Transaction[] => {
    let errorIndex = 0;
    try {
      return rowData.map((row, index) => {
        errorIndex = index + 1;
        console.log("row", row);
        if (!row.type || !row.date || !row.amount) throw new Error("Missing required fields");
        return {
          type: row.type as Transaction["type"],
          date: row.date as string,
          description: row.description as string,
          amount: parseFloat(row.amount as string),
          category: row.category as string,
          payee: row.payee as string,
        }
      });
    } catch (error) {
      // TODO: Scroll to and highlight row in dialog grid
      console.error("Error converting row data to transactions:", error);
      alert(`Error converting row data to transactions. Please check the file format. Row number - [${errorIndex}]`);
      return [];
    }
};

interface RowData {
    [key: string]: string | number; // Parsed rows
}
export {
    convertRowDataToTransactions
};
export type { RowData };
