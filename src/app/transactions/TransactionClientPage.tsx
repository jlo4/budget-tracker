"use client";

import React from "react";
import AddTransactionDialog from "./AddTransactionDialog";
import ResponsiveContainer from "@/components/Grid/ResponsiveContainer";
import TransactionList from "./TransactionList";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FileUploader from "@/components/FileUploader";

const TransactionClientPage = () => {
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <ResponsiveContainer 
            size={8}
            sx={{ mx: "auto", mt: 4 }}                
        >
            <AddTransactionDialog open={open} handleOpen={handleOpen} handleClose={handleClose} />              
            <Box>
                <Typography variant="h6">Upload Transactions</Typography>
                <FileUploader />
            </Box>
            <TransactionList />            
        </ResponsiveContainer>
    );
};

export default TransactionClientPage;