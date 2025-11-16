import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jack.thenas.us"),
  title: "Jack - Futures Trader & Hobbyist Developer",
  description: "Minimalist portfolio landing page for a modern creative.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-surface text-foreground transition-colors`}
      >
        <ThemeProvider>
          <div className="min-h-screen bg-surface text-foreground">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
