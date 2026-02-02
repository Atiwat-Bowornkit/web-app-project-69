// src/app/search/page.tsx
import { db } from '@/lib/db'
import Link from 'next/link'

// รับค่า searchParams (คำที่ค้นหา) จาก URL
export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  // ดึงคำค้นหาออกมา (ถ้าไม่มีให้เป็นค่าว่าง)
  // หมายเหตุ: ใน Next.js รุ่นใหม่ searchParams อาจจะต้อง await แต่รุ่นปัจจุบันใช้แบบนี้ได้เลย
  const query = searchParams?.q || ''

  // ค้นหาข้อมูลจาก Database
  const recipes = await db.recipe.findMany({
    where: {
      title: {
        contains: query, // ค้นหาที่มีคำนี้ผสมอยู่
        // mode: 'insensitive' // (ถ้าใช้ Postgres จะใส่บรรทัดนี้ได้เพื่อให้ค้นหาแบบไม่สนตัวพิมพ์เล็กใหญ่)
      },
    },
    include: { author: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="container mx-auto px-6 py-10 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
        🔍 ค้นหาสูตรอาหาร
      </h1>

      {/* ส่วนช่องค้นหา (Form) */}
      <div className="max-w-2xl mx-auto mb-12">
        <form action="/search" method="GET" className="flex gap-2">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="พิมพ์ชื่อเมนู เช่น กะเพรา, ต้มยำ..."
            className="flex-1 border-2 border-orange-200 rounded-full px-6 py-3 text-lg outline-none focus:border-orange-500 transition shadow-sm text-gray-700"
            autoFocus
          />
          <button
            type="submit"
            className="bg-orange-500 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition shadow-md"
          >
            ค้นหา
          </button>
        </form>
      </div>

      {/* แสดงผลลัพธ์ */}
      {query && (
        <p className="text-gray-500 mb-6">
          ผลการค้นหาสำหรับ "{query}" พบ {recipes.length} รายการ
        </p>
      )}

      {recipes.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
          <p className="text-gray-400 text-xl">ไม่พบสูตรอาหารที่คุณค้นหา</p>
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
              {/* รูปภาพ */}
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

              {/* เนื้อหา */}
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