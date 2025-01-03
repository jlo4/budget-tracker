"use client";

import React from "react";
import AddTransactionDialog from "./AddTransactionDialog";

const TransactionsClientPage = () => {
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <AddTransactionDialog open={open} handleOpen={handleOpen} handleClose={handleClose} />
        </>    
    );
};

export default TransactionsClientPage;