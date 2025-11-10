import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VideoHub - Universal Video Platform",
  description: "Watch videos from any source in one place. Supports YouTube, Google Drive, OneDrive, Terabox and more.",
  keywords: ["VideoHub", "video platform", "video streaming", "YouTube", "Google Drive", "OneDrive"],
  authors: [{ name: "VideoHub Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "VideoHub - Universal Video Platform",
    description: "Watch videos from any source in one place",
    url: "https://videohub.com",
    siteName: "VideoHub",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VideoHub - Universal Video Platform",
    description: "Watch videos from any source in one place",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
