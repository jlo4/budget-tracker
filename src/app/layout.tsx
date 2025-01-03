import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Roboto } from "next/font/google";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Grid2";
import Navigation from "../components/Navigation/Navigation";
import theme from "../theme";


const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Budget tracker",
  description: "Keep your budget on track",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.variable}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline>
              <Box>
                <Grid2 rowSpacing={2} container flexDirection={{ xs: "column", sm: "row" }}>
                  <Grid2 size="grow">
                      <Navigation />                              
                  </Grid2>
                  <Grid2 size={{ sm: 7, md: 8, lg: 9 , xl: 10 }}>
                    {children}
                  </Grid2>
                </Grid2>
              </Box>
            </CssBaseline>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
