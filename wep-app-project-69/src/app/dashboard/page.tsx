// src/app/dashboard/page.tsx
import { db } from '@/lib/db'
import Link from 'next/link'
import "../globals.css"

export default async function DashboardPage() {
  // ดึงสูตรอาหารทั้งหมดมาโชว์
  const recipes = await db.recipe.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: true }
  })

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* Hero Section เล็กๆ */}
      <div className="bg-orange-600 text-white py-12 px-6 shadow-md mb-10">
        <div className="container mx-auto">
            <h1 className="text-4xl font-bold mb-2">Weekly Popular 🌟</h1>
            <p className="text-orange-100">เมนูยอดฮิตประจำสัปดาห์ที่คัดสรรมาเพื่อคุณ</p>
        </div>
      </div>

      <div className="search-container mb-10">
        <h1>ค้นหาเมนูที่ต้องการ</h1>

        <label htmlFor="searchBox">🔍</label>
        <input type="text" id="searchBox" name="searchBox"></input>

        <label htmlFor="tags"></label>
        <select id="tags" name="tags" className="tagSearch mr-1  ml-1">
          <option>เมนูทอด</option>
        </select>

        <button type="submit" id="searchButton">ค้นหา</button>
      </div>

      {/* Grid แสดงรายการอาหาร */}
      <div className="container mx-auto px-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-orange-500 pl-4">
            All Recipes (สูตรทั้งหมด)
        </h2>

        {recipes.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                <p className="text-gray-500 text-xl">ยังไม่มีสูตรอาหารในระบบ</p>
                <Link href="/recipes/create" className="text-orange-500 font-bold hover:underline mt-2 inline-block">
                    + เพิ่มสูตรแรกของคุณเลย
                </Link>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
                <div key={recipe.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition duration-300 border border-gray-100 overflow-hidden group">
                    {/* ส่วนรูปภาพ */}
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

                    {/* ส่วนเนื้อหา */}
                    <div className="p-4">
                        <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">{recipe.title}</h3>
                        <p className="text-gray-500 text-sm line-clamp-2 mb-4 h-10">
                            {recipe.description || 'ไม่มีคำอธิบาย'}
                        </p>
                        
                        <div className="flex justify-between items-center text-xs text-gray-400 border-t pt-3">
                            <span>โดย {recipe.author.name}</span>
                            <span className="flex items-center gap-1">
                                🕒 {new Date(recipe.createdAt).toLocaleDateString('th-TH')}
                            </span>
                        </div>
                        
                        <Link 
                            href={`/recipes/${recipe.id}`} 
                            className="block mt-4 text-center w-full bg-gray-50 hover:bg-orange-50 text-orange-600 font-bold py-2 rounded border border-gray-200 transition text-sm"
                        >
                            ดูวิธีทำ →
                        </Link>
                    </div>
                </div>
            ))}
            </div>
        )}
      </div>
    </div>
  )
}