import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hackathons Directory | Find Global Hackathon Events",
  description: "Discover upcoming hackathons worldwide. Find opportunities to build, learn, and connect with developers at in-person and online hackathon events.",
  keywords: ["hackathons", "developer events", "coding competitions", "tech events", "blockchain hackathons"],
  authors: [{ name: "Hackathons Directory" }],
  creator: "Hackathons Directory",
  publisher: "Hackathons Directory",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Hackathons Directory",
    title: "Hackathons Directory | Find Global Hackathon Events",
    description: "Discover upcoming hackathons worldwide. Find opportunities to build, learn, and connect with developers at in-person and online hackathon events.",
    images: [
      {
        url: "/og-image.png", // You'll need to create this image
        width: 1200,
        height: 630,
        alt: "Hackathons Directory - Find your next coding competition",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hackathons Directory | Find Global Hackathon Events",
    description: "Discover upcoming hackathons worldwide. Find opportunities to build, learn, and connect with developers.",
    images: ["/og-image.png"], // Same image as OG
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  themeColor: "#ffffff",
  viewport: "width=device-width, initial-scale=1.0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id="bf8b6d22-b421-4176-975b-35d623527a81"
          strategy="afterInteractive"
          defer
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[#FAFAFA]`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
