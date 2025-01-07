import React, { useEffect } from "react";
import { fetchTransactions } from "@/backend/mongoDb/transactions";
import { Transaction, transactionKeys } from "@/lib/types/Transaction";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";
import Box from "@mui/material/Box";

const TransactionList = (
{
    hasBeenUpdated,
    setHasBeenUpdated
}: {
    hasBeenUpdated: boolean,
    setHasBeenUpdated: (param: boolean) => void
}) => {
    const [loading, setLoading] = React.useState(true);
    const [transactions, setTransactions] = React.useState<Transaction[]>([]);

    useEffect(() => {
        if (!hasBeenUpdated) {
            return;
        }
    
        const loadTransactions = async () => {
            try {
                setLoading(true);
                const response = await fetchTransactions();
                setTransactions(response ?? []);
            } catch (error) {
                console.error("Error fetching transactions", error);
            } finally {
                setLoading(false);
                setHasBeenUpdated(false);

            }
        };
        loadTransactions();
    }, [hasBeenUpdated, setHasBeenUpdated]);

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <>
            <h2>Transactions</h2>
            <Box style={{ width: "100%", maxWidth: "90vw", maxHeight: "70vh", overflow: "auto" }}>
                <DataGrid
                    initialState={{
                        sorting: { sortModel: [{ field: "date", sort: "desc" } ]},
                    }}
                    rows={transactions.map((transaction, index) => ({ id: index + 1, ...transaction, amount: new Intl.NumberFormat("fi-FI", { style: "currency", "currency": "EUR"}).format(transaction.amount) }))}
                    // TODO: Columns should be typed
                    columns={transactionKeys.map((field) => ({
                        field,
                        headerName: field[0].toUpperCase() + field.slice(1),
                        width: field === "description" ? 300 : 150,
                        valueFormatter: (value: Date | string | number) => {
                            if (field === "date") {
                                return dayjs(value).format("DD-MM-YYYY")
                            }
                        }
                    }))}
                    pageSizeOptions={[10, 25, 100]}
                />
            </Box>
        </>
    );
};

export default TransactionList;