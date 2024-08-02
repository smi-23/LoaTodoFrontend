import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/Header";
import AuthProvider from ".//components/AuthProvider";
import { Container } from "@mui/material";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LoaTodo",
  description: "LostArk Todo site",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          <Container
            sx={{
              mx: "auto",
              padding: 2,
              minHeight: "70vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
            maxWidth="10000px"
          >
            {children}
          </Container>
        </AuthProvider>
      </body>
    </html>
  );
}
