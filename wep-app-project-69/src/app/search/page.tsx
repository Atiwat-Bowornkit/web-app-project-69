import { db } from '@/lib/db'
import Link from 'next/link'

// 1. กำหนดรายการหมวดหมู่ (ให้ตรงกับที่คุณเคยบันทึกไว้ใน DB)
const CATEGORIES = [
  "อาหารเช้า",
  "อาหารจานเดียว",
  "ต้ม/แกง",
  "ผัด",
  "ทอด",
  "ของหวาน",
  "เครื่องดื่ม",
  "คลีน/สุขภาพ"
]

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }> // รับค่า category เพิ่ม
}) {
  // 2. แกะค่าจาก URL
  const { q, category } = await searchParams
  const query = q || ''
  const selectedCategory = category || 'all' // ถ้าไม่เลือก ให้เป็น all

  // 3. สร้างเงื่อนไขการค้นหา (Filter Object)
  const whereCondition: any = {
    title: {
      contains: query,
    },
  }

  // ถ้ามีการเลือกหมวดหมู่ (ที่ไม่ใช่ all) ให้เพิ่มเงื่อนไข category ลงไป
  if (selectedCategory !== 'all') {
    whereCondition.category = selectedCategory
  }

  // 4. ค้นหาจาก Database
  const recipes = await db.recipe.findMany({
    where: whereCondition, // ใส่เงื่อนไขที่เราสร้างไว้
    include: { author: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="container mx-auto px-6 py-10 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
        🔍 ค้นหาสูตรอาหาร
      </h1>

      {/* ส่วนช่องค้นหา (Form) */}
      <div className="max-w-3xl mx-auto mb-12">
        <form action="/search" method="GET" className="flex flex-col md:flex-row gap-3">
          
          {/* Dropdown เลือกหมวดหมู่ */}
          <select
            name="category"
            defaultValue={selectedCategory}
            className="border-2 border-orange-200 rounded-full px-6 py-3 text-lg outline-none focus:border-orange-500 transition shadow-sm text-gray-700 bg-white cursor-pointer md:w-1/4"
          >
            <option value="all">ทุกหมวดหมู่</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* ช่องพิมพ์คำค้นหา */}
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="ชื่อเมนู เช่น กะเพรา..."
            className="flex-1 border-2 border-orange-200 rounded-full px-6 py-3 text-lg outline-none focus:border-orange-500 transition shadow-sm text-gray-700"
          />

          {/* ปุ่มค้นหา */}
          <button
            type="submit"
            className="bg-orange-500 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition shadow-md whitespace-nowrap"
          >
            ค้นหา
          </button>
        </form>
      </div>

      {/* แสดงข้อความผลลัพธ์ */}
      {(query || selectedCategory !== 'all') && (
        <p className="text-gray-500 mb-6">
          ผลการค้นหา: 
          {query && <span className="font-bold text-gray-800"> "{query}" </span>}
          {selectedCategory !== 'all' && <span> ในหมวด <span className="font-bold text-orange-600"> {selectedCategory} </span></span>}
          พบ {recipes.length} รายการ
        </p>
      )}

      {/* Grid แสดงผลลัพธ์ */}
      {recipes.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
          <p className="text-gray-400 text-xl">ไม่พบสูตรอาหารตามเงื่อนไข</p>
          <Link href="/recipes/create" className="text-orange-500 hover:underline mt-2 inline-block">
            + ลองเพิ่มสูตรใหม่ดูไหม?
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <Link 
                key={recipe.id} 
                href={`/recipes/${recipe.id}`}
                className="group block bg-white rounded-xl shadow-sm hover:shadow-md transition duration-300 border border-gray-100 overflow-hidden"
            >
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                {recipe.imageUrl ? (
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl bg-gray-100">
                    🍳
                  </div>
                )}
                <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full shadow font-bold">
                    {recipe.category}
                </span>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-gray-900 text-lg mb-1 truncate group-hover:text-orange-600 transition">
                    {recipe.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-3 h-10">
                    {recipe.description || 'ไม่มีคำอธิบาย'}
                </p>
                <div className="flex justify-between items-center text-xs text-gray-400 border-t pt-3">
                    <span>โดย {recipe.author.name}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}