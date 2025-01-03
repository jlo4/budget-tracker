"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#3a6c94"
        }
    },
    typography: {
        fontFamily: "var(--font-roboto), Arial, sans-serif",
    },
});

export default theme;
