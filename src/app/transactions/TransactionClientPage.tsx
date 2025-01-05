"use client";

import { useState } from "react";
import AddTransactionDialog from "./AddTransactionDialog";
import ResponsiveContainer from "@/components/Grid/ResponsiveContainer";
import TransactionList from "./TransactionList";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FileUploader from "@/components/FileUploader";

const TransactionClientPage = () => {
    const [open, setOpen] = useState(false);
    const [hasBeenUpdated, setHasBeenUpdated] = useState(true);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <ResponsiveContainer 
            size={8}
            sx={{ mx: "auto", mt: 4 }}                
        >
            <AddTransactionDialog
                open={open}
                handleOpen={handleOpen}
                handleClose={handleClose}
                setHasBeenUpdated={setHasBeenUpdated}
            />
            <Box>
                <Typography variant="h6">Upload transactions</Typography>
                <FileUploader setHasBeenUpdated={setHasBeenUpdated} />
            </Box>
            <TransactionList hasBeenUpdated={hasBeenUpdated} setHasBeenUpdated={setHasBeenUpdated} />            
        </ResponsiveContainer>
    );
};

export default TransactionClientPage;