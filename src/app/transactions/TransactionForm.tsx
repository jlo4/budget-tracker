import { useEffect, useState } from "react";
import { Transaction } from "@/lib/types/Transaction";
import { TextField, MenuItem, Typography, FormControl } from "@mui/material";
import { styled } from "@mui/material/styles";


const categories = ["Salary", "Investments", "Groceries", "Rent", "Utilities", "Entertainment", "Transportation", "Healthcare", "Insurance", "Education", "Other"];

const NumberInput = styled(TextField)(({ }) => ({
  // Vendor prefixes aren't necessary because MUI handles them
    "& input[type=number]": {
      "appearance": "textfield",
    },
    "& input[type=number]::outer-spin-button, & input[type=number]::inner-spin-button": {
      "appearance": "none",
      margin: 0,
    },
}));

const TransactionForm = ({ transactionFromImage }: { transactionFromImage: Partial<Transaction> | null}) => {
  const [formData, setFormData] = useState<Transaction | null>({
    type: "expense",
    amount: 0,
    payee: "",
    category: "Groceries",
    date: "",
    description: "",
  });
  useEffect(() => {
    if (transactionFromImage) {
      console.log("Transaction from image:", transactionFromImage);
      setFormData({
        type: transactionFromImage.type || "expense",
        amount: transactionFromImage.amount || 0,
        payee: transactionFromImage.payee || "",
        category: transactionFromImage.category || "Groceries",
        date: transactionFromImage.date || "",
        description: transactionFromImage.description || "",
      });
    }
  }, [transactionFromImage]);
  
  const handleChange = (e: { target: { name: string; value: string | number }; }) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      if (!prevData) return null;
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  return (
    <FormControl fullWidth>
      <Typography variant="h6">Transaction</Typography>
      <TextField
        id="type"
        name="type"
        label="Type"
        value={formData?.type}
        onChange={handleChange}
        defaultValue={"income"}
        select                
        fullWidth
        margin="normal"
      >
        <MenuItem value="income">Income</MenuItem>
        <MenuItem value="expense">Expense</MenuItem>
      </TextField>
      <NumberInput
        id="amount"
        name="amount"
        label="Amount"
        value={formData?.amount}
        onChange={handleChange}
        type="number"
        slotProps={{ htmlInput: { min: "0", step: "0.01" } }}
        className="remove-arrows"
        fullWidth
        margin="normal"
        required
      />
      <TextField
        id="payee"
        name="payee"
        label="Payee"
        value={formData?.payee}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        id="category"
        name="category"
        label="Category"
        value={formData?.category}
        onChange={handleChange}
        defaultValue={"Groceries"}
        select
        fullWidth
        margin="normal"
        required
      >
        {categories.map((cat) => (
          <MenuItem key={cat} value={cat}>
            {cat}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        id="date"
        name="date"
        label="Date"
        value={formData?.date}
        onChange={handleChange}
        type="date"
        fullWidth
        margin="normal"
        required
        // shrink prevents the label from overlapping the text in the input field
        slotProps={{ inputLabel: { shrink: true } }}
      />
      <TextField
        id="description"
        name="description"
        label="Description"
        value={formData?.description}
        onChange={handleChange}
        fullWidth
        margin="normal"
        multiline
        rows={2}
      />
    </FormControl>
  );
};

export default TransactionForm;
