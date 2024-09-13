'use client'

import localFont from "next/font/local";
import '@mantine/core/styles.css';
import { createTheme, ColorSchemeScript, MantineProvider } from '@mantine/core';
import "./globals.css";
import Nav from "@/zunused/Nav";
import Header from "@/zunused/Header";
import { NavbarNested } from "@/zunused/NavbarNested/NavbarNested";
import { NavbarSegmented } from "@/components/NavbarSegmented/NavbarSegmented";
import { HeaderSimple } from "@/components/HeaderSimple/HeaderSimple";

const geistSans = localFont({
  src: "../util/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../util/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const theme = createTheme({
  /** Your theme override here */
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body 
      className={`${geistSans.variable} ${geistMono.variable}`}
      style={{
        height: '100vh', 
        overflow: 'hidden', 
        display: 'grid', 
        gridTemplateRows: 'auto 1fr',
        gridTemplateColumns:'auto 1fr', 
      }}>
        <MantineProvider theme={theme}>
          <div style={{gridRow: ' 1 /2 ', gridColumn: '1 / 3'}}>
          <HeaderSimple/>
          </div>
          <NavbarSegmented/>
          <main>
            {children}
          </main>
        </MantineProvider>
      </body>
    </html>
  );
}
