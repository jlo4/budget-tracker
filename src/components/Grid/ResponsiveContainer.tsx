import Grid from "@mui/material/Grid2";
import Item from "@mui/material/Grid2";
import { SxProps, Theme } from "@mui/material/styles";
import React from "react";

interface ResponsiveContainerProps {
    children?: React.ReactNode[]; 
    size?: number;
    sx?: SxProps<Theme>;
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({ children, size, sx }) => {

    return (
        <Grid container columnGap={8} spacing={2} sx={sx}>
            {children?.map((child, index) => {
                return (
                    <Grid key={index} size={size ?? 12} sx={{mx: 2 }}>
                        <Item>
                            {child}
                        </Item>                    
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default ResponsiveContainer;