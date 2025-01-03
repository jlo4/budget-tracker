import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import { convertRowDataToTransactions, RowData } from "@/utils/gridData";
import TransactionForm from "./TransactionForm";
import { insertTransactions } from "@/backend/mongoDb/transactions";

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
                        const formData = new FormData(event.currentTarget);
                        const formJson: RowData = Object.fromEntries(
                            Array.from((formData as FormData).entries())
                                .map(([key, value]) => 
                                    [key, typeof value === "string" || typeof value === "number" ? value : ""]
                                )
                        );
                        const transactions = convertRowDataToTransactions([formJson]);
                        await insertTransactions(transactions);
                        handleClose();
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
                    <Button type="submit">Add</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AddTransactionDialog;