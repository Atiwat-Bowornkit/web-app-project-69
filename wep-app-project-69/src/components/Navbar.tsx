// src/components/Navbar.tsx
import Link from 'next/link'
import { logout } from '@/app/actions'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/session'

export default async function Navbar() {
  // เช็คสถานะ Login
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session')?.value
  const session = await decrypt(sessionToken)
  const user = session?.userId ? { name: 'User' } : null

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo - กดแล้วไปหน้า Feed รวม (Dashboard ใหม่) */}
        <Link href="/dashboard" className="text-xl font-bold text-orange-600 flex items-center gap-2">
           👨‍🍳 FoodHub
        </Link>

        {/* Menu Links - เมนูตรงกลาง */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/dashboard" className="hover:text-orange-600 transition">หน้าหลัก</Link>
          <Link href="/search" className="hover:text-orange-600 transition">ค้นหา</Link>
          <Link href="/inventory" className="hover:text-orange-600 transition">คลังวัตถุดิบ</Link>
        </div>
        
        {/* Right Side Actions - เมนูขวา (Login/Profile) */}
        <div className="flex items-center gap-4">
            {user ? (
                <>
                    {/* ปุ่มเพิ่มสูตร */}
                    <Link 
                        href="/recipes/create" 
                        className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm hover:bg-orange-600 transition flex items-center gap-1 font-bold shadow-sm"
                    >
                        + เพิ่มสูตร
                    </Link>
                    
                    {/* ปุ่มไปหน้า Profile (รูปคน) */}
                    <Link 
                        href="/profile" 
                        className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-orange-100 hover:text-orange-600 transition border border-gray-200"
                        title="โปรไฟล์ของฉัน"
                    >
                        👤
                    </Link>

                    {/* ปุ่ม Logout (แบบย่อ) */}
                    
                </>
            ) : (
                <Link 
                    href="/login" 
                    className="text-orange-600 font-bold text-sm bg-orange-50 px-4 py-2 rounded-full hover:bg-orange-100 transition"
                >
                    เข้าสู่ระบบ
                </Link>
            )}
        </div>
      </div>
      
    </nav>
  )
}