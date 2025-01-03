import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import TransactionForm from "./TransactionForm";

interface AddTransactionDialogProps {
    handleClose: () => void;    
    handleOpen: () => void;
    open: boolean;    
}

const AddTransactionDialog: React.FC<AddTransactionDialogProps> = ({ handleClose, handleOpen, open }) => {
    return (
        <>
            <Typography variant="h6">Add a Transaction</Typography>
            <Button variant="contained" color="primary" onClick={handleOpen}>Add</Button>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: "form",
                    onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                    }
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <DialogTitle>Add Transaction</DialogTitle>
                <DialogContent>
                    <TransactionForm />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AddTransactionDialog;