import type { Metadata } from "next";
import "./globals.css";
import HydrationErrorHandler from "./components/HydrationErrorHandler";
import { Providers } from "./context/Providers";

// Use system fonts instead of Google Fonts for better CI/CD compatibility
const fontClass = "font-sans";

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
      <body className={fontClass}>
        <HydrationErrorHandler />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
