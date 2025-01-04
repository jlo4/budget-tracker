import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import React from "react";

interface DialogActions {
    handleCancel?: () => void;
    handleConfirm?: () => void;
}

interface DialogProps {
    actions: DialogActions;
    children: React.ReactNode;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    title: string;
}

const StyledDialog: React.FC<DialogProps> = ({ actions, children, isOpen, setIsOpen }) => {
    if (!isOpen) return null;
    const onClose = actions.handleCancel ? actions.handleCancel : () => setIsOpen(false);
    const onCancel = actions.handleCancel ? actions.handleCancel : () => {};
    const onConfirm = actions.handleConfirm ? actions.handleConfirm : () => {};

    return (
        <Dialog open={isOpen} onClose={onClose}>
          <DialogTitle>Preview</DialogTitle>
          <DialogContent>
            {children}
          </DialogContent>
          <DialogActions>
            {actions.handleCancel && <Button variant="outlined" color="secondary" onClick={onCancel}>
              Cancel
            </Button>}
            {actions.handleConfirm && <Button
              variant="contained"
              color="primary"
              onClick={onConfirm}
              style={{ marginRight: "10px" }}
            >
              Confirm
            </Button>}
          </DialogActions>
        </Dialog>
    );
};

export default StyledDialog;