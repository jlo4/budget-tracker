import { useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { convertRowDataToTransactions, RowData } from "@/utils/gridData";
import { insertTransactions } from "@/backend/mongoDb/transactions";
import Papa, { ParseResult } from "papaparse";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const useUploadCsvFile = () => {
    const [rows, setRows] = useState<RowData[]>([]);
    const [columns, setColumns] = useState<GridColDef[]>([]);
    const [isPreview, setIsPreview] = useState(false);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const file = event.target.files?.[0];
    
        if (!file) {
          alert("No file selected.");
          return;
        }
    
        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
          alert("File is too large. Please upload a file smaller than 10 MB.");
          return;
        }
    
        // Parse the CSV file
        Papa.parse<RowData>(file, {
          header: true, // Treat the first row as column headers
          skipEmptyLines: true,
          complete: (result: ParseResult<RowData>) => {
            if (result.errors.length > 0) {
              alert("Error parsing file. Please check the file format.");
              console.error(result.errors);
              return;
            }
    
            const parsedRows = result.data;
            const parsedColumns: GridColDef[] = Object.keys(parsedRows[0] || {}).map((field) => ({
              field,
              headerName: field,
              width: 150,
            }));
    
            setRows(
              parsedRows.map((row, index) => ({
                id: index, // Add an ID for DataGrid
                ...row,
              }))
            );
            setColumns(parsedColumns);
            setIsPreview(true); // Show the preview grid
          },
        });
      };
    
      const handleConfirm = async (): Promise<void> => {
        const transactions = convertRowDataToTransactions(rows);
        if (transactions.length === 0) {
          // There was an error, keep the preview open to allow the user to fix it
          return;
        };
        await insertTransactions(transactions);
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