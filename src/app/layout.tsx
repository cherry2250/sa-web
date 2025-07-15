import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/widgets/sidebar/ui/Sidebar";
import { Header } from "@/widgets/header/ui/Header";
import { useEffect } from "react";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SA Web",
  description: "ICT Core Eng팀에서 사용하는 AI WEB 입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  useEffect(() => {
    const setVh = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };
    setVh();
    window.addEventListener('resize', setVh);
    return () => window.removeEventListener('resize', setVh);
  }, []);
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div style={{ display: "flex", height: "100vh" }}>
          <Sidebar />
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              height: "100vh",
            }}
          >
            <Header />
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
