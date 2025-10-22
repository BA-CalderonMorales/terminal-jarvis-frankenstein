import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import HydrationErrorHandler from "./components/HydrationErrorHandler";
import { Providers } from "./context/Providers";

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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <HydrationErrorHandler />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
