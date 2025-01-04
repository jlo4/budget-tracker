import React, { useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { RowData } from "@/utils/gridData";
import HiddenInput from "./HiddenInput";
import StyledDialog from "./StyledDialog";

const FileUploader: React.FC = () => {
  const [rows, setRows] = useState<RowData[]>([]);
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [isPreview, setIsPreview] = useState(false);

  const handleConfirm = async (): Promise<void> => {   
    setIsPreview(false);
  };

  const handleCancel = (): void => {
    setRows([]);
    setColumns([]);
    setIsPreview(false);
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
          onChange={() => {}}
          multiple
      />
        Upload files
      </Button>

      {isPreview ? (
        <StyledDialog
          isOpen={isPreview}
          setIsOpen={setIsPreview}
          title="Upload transactions"
          actions={{ handleCancel, handleConfirm }}
        >
          <div style={{ height: 400, width: "100%", marginBottom: "20px" }}>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSizeOptions={[10, 25, 100]}
              />
            </div>
        </StyledDialog>
      ) : <></>}
    </>
  );
};

export default FileUploader;
