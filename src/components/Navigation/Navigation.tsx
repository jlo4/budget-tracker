"use client";

import React, { useState } from "react";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "./Sidebar";
import config from "@/config";

const Navigation = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <>
            <AppBar sx={{ display: { xs: "block", sm: "none" } }} position="static" component="nav">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: "none" } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, display: { xs: "flex", sm: "none" } }}>
                        {config.applicationName}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Sidebar handleDrawerToggle={handleDrawerToggle} mobileOpen={mobileOpen} />
        </>
    );
};

export default Navigation;