import config from "@/config";
import { Drawer, List, ListItem, ListItemText, Toolbar, Typography, Box, useTheme } from "@mui/material";
import Link from "next/link";

const drawerWidth = 240;

const Sidebar = ({ handleDrawerToggle }: { handleDrawerToggle: () => void, mobileOpen: boolean }) => {
    const theme = useTheme();
    const createDrawerItems = () => {
        return [
            { text: "Home", href: "/" },
            { text: "Transactions", href: "/transactions" },
            { text: "Goals", href: "/goals" },
        ];
    };

    const drawerContent = (
        <Box sx={{ backgroundColor: theme.palette.primary.main, color: "white", display: "flex", flexDirection: "column", height: "100%" }}>
            <Toolbar sx={{ color: "white", }}>
                <Typography variant="h6" noWrap>
                    {config.applicationName}
                </Typography>
            </Toolbar>
            <List sx={{ color: "white" }}>
                {createDrawerItems().map((item) => (
                    <ListItem key={item.text}>
                        <Link onClick={handleDrawerToggle} href={item.href}>
                            <ListItemText sx={{ color: "white", textDecorationLine: "inherit" }} primary={item.text} />
                        </Link>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <nav>
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: "none", sm: "block" },
                    "& .MuiDrawer-paper": { backgroundColor: theme.palette.primary.main, boxSizing: "border-box", color: "white", width: drawerWidth },
                }}
                open
            >
                {drawerContent}
            </Drawer>
        </nav>
    )
};

export default Sidebar;
