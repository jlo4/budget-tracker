import React, { useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Papa, { ParseResult } from "papaparse";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { insertTransactions } from "@/backend/mongoDb/transactions";
import { convertRowDataToTransactions, RowData } from "@/utils/gridData";
import HiddenInput from "./HiddenInput";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const FileUploader: React.FC = () => {
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
    setIsPreview(false); // Clear the preview
  };

  const handleCancel = (): void => {
    setRows([]);
    setColumns([]);
    setIsPreview(false); // Clear the preview
  };

  return (
    <>
      <Button
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
          sx={{ maxWidth: "200px", width: "50vw" }}
      >
      <HiddenInput
          type="file"
          accept=".csv, .xls, .xlsx"
          onChange={handleFileUpload}
          multiple
      />
        Upload files
      </Button>

      {isPreview ? (
        <Dialog open={isPreview} onClose={handleCancel}>
          <DialogTitle>Preview</DialogTitle>
          <DialogContent>
            <div style={{ height: 400, width: "100%", marginBottom: "20px" }}>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSizeOptions={[10, 25, 100]}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" color="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirm}
              style={{ marginRight: "10px" }}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      ) : <></>}
    </>
  );
};

export default FileUploader;
