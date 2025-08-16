import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import HydrationErrorHandler from "./components/HydrationErrorHandler";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Terminal Jarvis Frankenstein",
  description: "AI-powered application builder with code execution sandboxes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <HydrationErrorHandler />
        {children}
      </body>
    </html>
  );
}
