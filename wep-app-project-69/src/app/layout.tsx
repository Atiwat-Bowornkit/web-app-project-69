import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "คลังสูตรอาหาร",
  description: "ระบบจัดการและค้นหาสูตรอาหาร",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* แก้ตรงนี้: เปลี่ยนจาก bg-stone-50 เป็น bg-white */}
      <body className={`${inter.className} bg-white text-stone-800`}>
        
        <Navbar />
        
        {children}
        
      </body>
    </html>
  );
}