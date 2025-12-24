import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Painting Generator",
  description: "Transform your images into beautiful paintings with AI",
};

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <MainContent>{children}</MainContent>
        </div>
      </body>
    </html>
  );
}

function MainContent({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex-1 flex flex-col overflow-hidden transition-all duration-300"
      id="main-content"
      style={{ marginLeft: "256px" }}
    >
      <Header />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
