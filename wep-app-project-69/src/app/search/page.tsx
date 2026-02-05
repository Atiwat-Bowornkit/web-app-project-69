import { db } from '@/lib/db'
import Link from 'next/link'
import { addMealToPlan } from '@/app/actions/planner' // 1. เรียกใช้ Action
import { PlusCircle } from 'lucide-react'

const CATEGORIES = [
  "อาหารเช้า", "อาหารจานเดียว", "ต้ม/แกง", "ผัด", 
  "ทอด", "ของหวาน", "เครื่องดื่ม", "คลีน/สุขภาพ"
]

export default async function SearchPage({
  searchParams,
}: {
  // 2. เพิ่ม Type รองรับ parameter จาก Planner
  searchParams: Promise<{ q?: string; category?: string; select_for?: string; date?: string }> 
}) {
  const { q, category, select_for, date } = await searchParams
  const query = q || ''
  const selectedCategory = category || 'all'

  // ตรวจสอบว่ากำลังอยู่ในโหมด "เลือกอาหารลงตาราง" หรือไม่
  const isSelectionMode = !!(select_for && date)

  const whereCondition: any = {
    title: { contains: query },
  }

  if (selectedCategory !== 'all') {
    whereCondition.category = selectedCategory
  }

  const recipes = await db.recipe.findMany({
    where: whereCondition,
    include: { author: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="container mx-auto px-6 py-10 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
        {isSelectionMode ? '📅 เลือกเมนูลงตาราง' : '🔍 ค้นหาสูตรอาหาร'}
      </h1>

      {/* ถ้าอยู่ในโหมดเลือกอาหาร แสดงแถบแจ้งเตือน */}
      {isSelectionMode && (
        <div className="bg-orange-50 border border-orange-200 text-orange-800 px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
          <span>
            กำลังเลือกมื้อ <strong>{select_for === 'breakfast' ? 'เช้า' : select_for === 'lunch' ? 'เที่ยง' : 'เย็น'}</strong> 
            สำหรับวันที่ <strong>{new Date(date!).toLocaleDateString('th-TH')}</strong>
          </span>
          <Link href="/planner" className="text-sm underline hover:text-orange-600">ยกเลิก</Link>
        </div>
      )}

      {/* Form ค้นหา (ส่งค่า select_for และ date ตามไปด้วย ถ้ามี) */}
      <div className="max-w-3xl mx-auto mb-12">
        <form action="/search" method="GET" className="flex flex-col md:flex-row gap-3">
          {/* ซ่อน Input ไว้เพื่อส่งค่าเดิมตามไปตอนกดค้นหา */}
          {isSelectionMode && (
            <>
              <input type="hidden" name="select_for" value={select_for} />
              <input type="hidden" name="date" value={date} />
            </>
          )}

          <select
            name="category"
            defaultValue={selectedCategory}
            className="border-2 border-orange-200 rounded-full px-6 py-3 text-lg outline-none focus:border-orange-500 transition shadow-sm text-gray-700 bg-white cursor-pointer md:w-1/4"
          >
            <option value="all">ทุกหมวดหมู่</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="ชื่อเมนู เช่น กะเพรา..."
            className="flex-1 border-2 border-orange-200 rounded-full px-6 py-3 text-lg outline-none focus:border-orange-500 transition shadow-sm text-gray-700"
          />

          <button
            type="submit"
            className="bg-orange-500 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition shadow-md whitespace-nowrap"
          >
            ค้นหา
          </button>
        </form>
      </div>

      {/* Grid แสดงผล */}
      {recipes.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
          <p className="text-gray-400 text-xl">ไม่พบสูตรอาหารตามเงื่อนไข</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <div 
                key={recipe.id} 
                className="group block bg-white rounded-xl shadow-sm hover:shadow-md transition duration-300 border border-gray-100 overflow-hidden relative"
            >
              <Link href={`/recipes/${recipe.id}`} className="block">
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  {recipe.imageUrl ? (
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl bg-gray-100">🍳</div>
                  )}
                  <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full shadow font-bold">
                      {recipe.category}
                  </span>
                </div>
                
                <div className="p-4 pb-14"> {/* เพิ่ม padding ด้านล่างเผื่อปุ่ม */}
                  <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">{recipe.title}</h3>
                  <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>โดย {recipe.author.name}</span>
                  </div>
                </div>
              </Link>

              {/* ปุ่ม Action */}
              <div className="absolute bottom-3 left-3 right-3">
                {isSelectionMode ? (
                  // ถ้ามาจาก Planner -> แสดงปุ่ม "เลือกเมนูนี้"
                  <form action={async () => {
                    'use server'
                    await addMealToPlan(recipe.id, date!, select_for!)
                  }}>
                    <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition flex items-center justify-center gap-2 text-sm shadow-md">
                      <PlusCircle size={16} /> เลือกเมนูนี้
                    </button>
                  </form>
                ) : (
                  // ถ้ามาค้นหาปกติ -> แสดงปุ่ม "ดูวิธีทำ"
                  <Link 
                    href={`/recipes/${recipe.id}`}
                    className="block w-full text-center bg-gray-100 hover:bg-orange-100 text-gray-600 hover:text-orange-600 font-bold py-2 rounded-lg transition text-sm"
                  >
                    ดูวิธีทำ
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}