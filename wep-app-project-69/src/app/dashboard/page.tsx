import { db } from '@/lib/db'
import Link from 'next/link'
import FavoriteButton from '@/components/FavoriteButton'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/session'

export default async function DashboardPage() {
  // 1. ดึง User ID
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session')?.value
  const session = await decrypt(sessionToken)
  const currentUserId = session?.userId ? Number(session.userId) : null

  // 2. ดึง "Weekly Popular" (2 อันดับที่มีคนกดไลก์เยอะสุด)
  const popularRecipes = await db.recipe.findMany({
    take: 2, // เอาแค่ 2 อัน
    orderBy: {
      favorites: {
        _count: 'desc' // เรียงตามจำนวน favorites มากไปน้อย
      }
    },
    include: {
      author: true,
      favorites: { where: { userId: currentUserId || -1 } }, // เช็คว่าเรากดไลก์ยัง
      _count: { select: { favorites: true } } // นับจำนวนไลก์ทั้งหมด
    }
  })

  // 3. ดึง "All Recipes" (สูตรทั้งหมด เรียงตามใหม่ล่าสุด)
  const recentRecipes = await db.recipe.findMany({
    orderBy: { createdAt: 'desc' },
    include: { 
      author: true,
      favorites: { where: { userId: currentUserId || -1 } }, // เช็คว่าเรากดไลก์ยัง
      _count: { select: { favorites: true } } // นับจำนวนไลก์ทั้งหมด
    }
  })

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* --- Hero Section: Weekly Popular (Dynamic) --- */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white py-12 px-6 shadow-md mb-10">
        <div className="container mx-auto">
            <h1 className="text-4xl font-bold mb-2">เมนูยอดนิยม</h1>
             

            {/* Grid แสดง 2 เมนูยอดฮิต */}
            {popularRecipes.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {popularRecipes.map((recipe, index) => (
                   <div key={recipe.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex gap-4 border border-white/20 hover:bg-white/20 transition cursor-pointer">
                      {/* รูปเล็ก */}
                      <div className="w-24 h-24 flex-shrink-0 bg-gray-300 rounded-lg overflow-hidden relative">
                        {recipe.imageUrl ? (
                           <img src={recipe.imageUrl} className="w-full h-full object-cover" alt={recipe.title} />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center text-2xl">🍳</div>
                        )}
                        <div className="absolute top-1 left-1 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                           #{index + 1}
                        </div>
                      </div>
                      
                      {/* ข้อมูล */}
                      <div className="flex-1 min-w-0 text-white">
                         <h3 className="font-bold text-xl truncate">{recipe.title}</h3>
                         <p className="text-orange-100 text-sm mb-2">โดย {recipe.author.name}</p>
                         <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded text-xs">
                              ถูกใจ {recipe._count.favorites} คน
                            </span>
                            <Link href={`/recipes/${recipe.id}`} className="text-xs font-bold underline hover:text-orange-200">
                               ดูสูตร →
                            </Link>
                         </div>
                      </div>
                   </div>
                 ))}
               </div>
            ) : (
               <p className="text-white/60 italic">ยังไม่มีข้อมูลยอดนิยมในขณะนี้</p>
            )}
        </div>
      </div>

      {/* --- Grid แสดงรายการอาหารทั้งหมด --- */}
      <div className="container mx-auto px-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-orange-500 pl-4 flex items-center justify-between">
            <span>สูตรอาหารทั้งหมด</span>
            <span className="text-sm font-normal text-gray-500">ทั้งหมด {recentRecipes.length} สูตร</span>
        </h2>

        {recentRecipes.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-500 text-xl">ยังไม่มีสูตรอาหารในระบบ</p>
                <Link href="/recipes/create" className="text-orange-500 font-bold hover:underline mt-2 inline-block">
                    + เพิ่มสูตรแรกของคุณเลย
                </Link>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentRecipes.map((recipe) => (
                  <div key={recipe.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition duration-300 border border-gray-100 overflow-hidden group relative">
                      
                      {/* ส่วนรูปภาพ */}
                      <div className="h-48 bg-gray-200 relative overflow-hidden">
                          {/* ปุ่ม Favorite */}
                          {currentUserId && (
                            <>
                              <FavoriteButton 
                                recipeId={recipe.id} 
                                userId={currentUserId}
                                initialIsFavorite={recipe.favorites.length > 0} 
                              />
                              {/* --- แสดงจำนวน Like บนรูปภาพ --- */}
                            
                            </>
                          )}

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
                                  {/* ไอคอนหัวใจเล็กๆ แสดงจำนวนรวมตรง footer การ์ดด้วย */}
                                  <span className="flex items-center gap-1 text-red-500 font-bold bg-red-50 px-1.5 py-0.5 rounded">
                                    ถูกใจ {recipe._count.favorites} คน
                                  </span>
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