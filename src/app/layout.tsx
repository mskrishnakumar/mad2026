import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MAD2026 - Hackathon Starter Kit",
    template: "%s | MAD2026",
  },
  description: "A Next.js hackathon starter kit with AI-powered chat, smart recommendations, and modern UI components.",
  keywords: ["hackathon", "nextjs", "react", "ai", "chat", "recommendations"],
  authors: [{ name: "MAD2026 Team" }],
  openGraph: {
    title: "MAD2026 - Hackathon Starter Kit",
    description: "A Next.js hackathon starter kit with AI-powered chat, smart recommendations, and modern UI components.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
