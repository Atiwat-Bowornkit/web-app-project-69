import React from 'react';
import { ChefHat, PlusCircle, User } from 'lucide-react';
import Link from 'next/link'; // ใช้ Link ของ Next.js เพื่อการเปลี่ยนหน้าที่ลื่นไหล

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200 px-6 py-4 flex justify-between items-center shadow-sm">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 cursor-pointer">
        <div className="bg-orange-500 text-white p-2 rounded-lg shadow-orange-200 shadow-md">
          <ChefHat size={24} />
        </div>
        <span className="text-xl font-bold tracking-tight text-stone-800">
          FOOD<span className="text-orange-500">HUB</span>
        </span>
      </Link>

      {/* Right Menu */}
      <div className="flex items-center space-x-6">
        <div className="hidden md:flex items-center text-stone-600 font-medium text-sm">
          <button className="px-4 py-2 hover:text-orange-600 transition-colors border-r border-stone-300">
            ปฏิทินอาหาร
          </button>
          <button className="px-4 py-2 hover:text-orange-600 transition-colors flex items-center gap-2">
            <PlusCircle size={18} />
            เพิ่มสูตร
          </button>
        </div>
        {/* User Icon */}
        <button className="bg-stone-100 p-2 rounded-full border border-stone-200 hover:bg-orange-100 hover:border-orange-200 transition-all shadow-sm">
          <User size={24} className="text-stone-600" />
        </button>
      </div>
    </nav>
  );
}