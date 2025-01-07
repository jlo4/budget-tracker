import { useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { convertRowDataToTransactions, RowData } from "@/utils/gridData";
import { insertTransactions } from "@/backend/mongoDb/transactions";
import { parseTransactionFile } from "@/backend/csv/opFileParser";
import { transactionKeys } from "@/lib/types/Transaction";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const useUploadCsvFile = ({ setHasBeenUpdated }: { setHasBeenUpdated: (param: boolean) => void}) => {
    const [rows, setRows] = useState<RowData[]>([]);
    const [columns, setColumns] = useState<GridColDef[]>([]);
    const [isPreview, setIsPreview] = useState(false);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const file = event.target.files?.[0];
    
        if (!file) {
          alert("No file selected.");
          return;
        }
        
        if (file.size > MAX_FILE_SIZE) {
          alert("File is too large. Please upload a file smaller than 10 MB.");
          return;
        }
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = async (e) => {
          const data = e.target?.result;
          if (!data) {
            alert("Error reading file.");
            return;
          }

          const transactions = await parseTransactionFile(data);
          if (!transactions) {
            alert("Error parsing file. Please check the file format.");
            return;
          }

          const parsedColumns: GridColDef[] = transactionKeys.map((field) => {
            return {
              field,
              headerName: field[0].toUpperCase() + field.slice(1),
              width: 150,
            };
          });

          setRows(transactions.map((transaction, index) => {
            return {
              id: index, // Add an ID for DataGrid
              type: transaction.type,
              date: transaction.date,
              payee: transaction.payee ?? "",
              description: transaction.description ?? "",
              amount: transaction.amount,
              category: transaction.category ?? "",
            };
          }));
          setColumns(parsedColumns);
          setIsPreview(true);
        };        
        
      };
    
      const handleConfirm = async (): Promise<void> => {
        const transactions = convertRowDataToTransactions(rows);
        if (transactions.length === 0) {
          // There was an error, keep the preview open to allow the user to fix it
          return;
        };
        await insertTransactions(transactions);
        setHasBeenUpdated(true);
        setIsPreview(false);
      };
    
      const handleCancel = (): void => {
        setRows([]);
        setColumns([]);
        setIsPreview(false);
      };

    return { columns, handleCancel, handleConfirm, handleFileUpload, isPreview, rows, setColumns, setIsPreview, setRows };
};

export default useUploadCsvFile;