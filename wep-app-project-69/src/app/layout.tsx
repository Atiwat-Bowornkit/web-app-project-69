import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Food Recipe App",
  description: "จัดการสูตรอาหารของคุณ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* จุดสำคัญที่แก้: 
        1. bg-gray-50 -> ใส่สีพื้นหลังให้เป็นเทาอ่อนๆ (ไม่ขาวล้วน)
        2. text-gray-900 -> บังคับให้ตัวหนังสือเป็นสีดำเข้ม (แก้ปัญหาตัวหนังสือล่องหน)
      */}
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}>
        <Navbar />
        <main className="min-h-screen">
            {children}
        </main>
      </body>
    </html>
  );
}