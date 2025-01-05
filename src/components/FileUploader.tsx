import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import HiddenInput from "./HiddenInput";
import StyledDialog from "./StyledDialog";
import useUploadCsvFile from "@/hooks/useUploadCsvFile";

const FileUploader = ({ setHasBeenUpdated }: { setHasBeenUpdated: (param: boolean) => void}) => {
  const {
    columns,
    handleCancel,
    handleConfirm,
    handleFileUpload,
    isPreview,
    rows,
    setIsPreview
  } = useUploadCsvFile({ setHasBeenUpdated });

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
        Upload file
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
