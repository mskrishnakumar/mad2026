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
    default: "Mission Possible - Magic Bus Upskilling Programme",
    template: "%s | Mission Possible",
  },
  description: "Magic Bus Upskilling Programme - Empowering youth through skills training and career development.",
  keywords: ["magic bus", "upskilling", "youth empowerment", "skills training", "career development"],
  authors: [{ name: "Magic Bus Team" }],
  openGraph: {
    title: "Mission Possible - Magic Bus Upskilling Programme",
    description: "Magic Bus Upskilling Programme - Empowering youth through skills training and career development.",
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
