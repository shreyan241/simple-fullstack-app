"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { UserProvider } from '@auth0/nextjs-auth0/client';
import "./globals.css";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from '../theme';
import OrderProvider from '@/contexts/OrderProvider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Override theme with Geist font
const customTheme = {
  ...theme,
  typography: {
    ...theme.typography,
    fontFamily: geistSans.style.fontFamily,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <UserProvider>
          <ThemeProvider theme={customTheme}>
            <CssBaseline />
            <OrderProvider>
              {children}
            </OrderProvider>
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}
