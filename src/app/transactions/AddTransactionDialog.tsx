import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import { convertRowDataToTransactions, RowData } from "@/utils/gridData";
import TransactionForm from "./TransactionForm";
import { insertTransactions } from "@/backend/mongoDb/transactions";
import PhotoUploader from "@/components/photo/PhotoUploader";
import { Transaction } from "@/lib/types/Transaction";

interface AddTransactionDialogProps {
    handleClose: () => void;    
    handleOpen: () => void;
    open: boolean;
    setHasBeenUpdated: (param: boolean) => void;
}

const AddTransactionDialog: React.FC<AddTransactionDialogProps> = ({ handleClose, handleOpen, open, setHasBeenUpdated }) => {
    const [transactionFromImage, setTransactionFromImage] = useState<Partial<Transaction> | null>(null);
    const getTransactionFromImage = (transaction: Partial<Transaction> | null) => {
        console.log("Transaction from image:", transaction);
        setTransactionFromImage(transaction);
    };

    return (
        <>
            <Typography variant="h6">Add a transaction</Typography>
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
                        setHasBeenUpdated(true);
                        handleClose();
                    }
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <DialogTitle>Add transaction</DialogTitle>
                <DialogContent>
                    <PhotoUploader getTransactionFromImage={getTransactionFromImage} />
                    <TransactionForm transactionFromImage={transactionFromImage} />
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