// src/app/dashboard/page.tsx
import { db } from '@/lib/db'
import Link from 'next/link'
import FavoriteButton from '@/components/FavoriteButton'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/session'
import { ChevronLeft, ChevronRight } from 'lucide-react' // เพิ่ม Icon ลูกศร

// เพิ่ม Interface รับค่า page
interface DashboardProps {
  searchParams: Promise<{ page?: string }>
}

export default async function DashboardPage({ searchParams }: DashboardProps) {
  // 1. ดึง User ID
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session')?.value
  const session = await decrypt(sessionToken)
  const currentUserId = session?.userId ? Number(session.userId) : null

  // --- ส่วนคำนวณ Pagination ---
  const { page } = await searchParams
  const currentPage = Number(page) || 1 // หน้าปัจจุบัน (ค่าเริ่มต้น 1)
  const itemsPerPage = 8 // จำนวนต่อหน้า
  const skip = (currentPage - 1) * itemsPerPage

  // 2. ดึง "Weekly Popular" (2 อันดับเหมือนเดิม)
  const popularRecipes = await db.recipe.findMany({
    take: 2,
    orderBy: {
      favorites: {
        _count: 'desc'
      }
    },
    include: {
      author: true,
      favorites: { where: { userId: currentUserId || -1 } },
      _count: { select: { favorites: true } }
    }
  })

  // 3. ดึง "Recent Recipes" (เพิ่ม skip และ take)
  const recentRecipes = await db.recipe.findMany({
    orderBy: { createdAt: 'desc' },
    skip: skip,           // <--- ข้ามไปตามหน้า
    take: itemsPerPage,   // <--- ดึงแค่ 8 อัน
    include: { 
      author: true,
      favorites: { where: { userId: currentUserId || -1 } },
      _count: { select: { favorites: true } }
    }
  })

  // 4. นับจำนวนทั้งหมดเพื่อสร้างปุ่มเลขหน้า
  const totalRecipes = await db.recipe.count()
  const totalPages = Math.ceil(totalRecipes / itemsPerPage)

  return (
    <div className="bg-[url('/images/BG.jpg')] bg-cover bg-center bg-no-repeat min-h-screen pt-6 ">
      <div className="dashMain">

        <div className="min-h-screen bg-white/90 pb-20 backdrop-blur-sm">
      
          {/* --- Hero Section: Weekly Popular --- */}
          <div className="rounded-t-2xl bg-gradient-to-r from-orange-600 to-orange-500 text-white py-12 px-6 shadow-md mb-10">
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
          <div className="container mx-auto px-6" id="all-recipes">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-orange-500 pl-4">
                    สูตรอาหารทั้งหมด
                </h2>
                <span className="text-sm text-gray-500">
                    หน้า {currentPage} จาก {totalPages}
                </span>
            </div>

            {recentRecipes.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-xl">ยังไม่มีสูตรอาหารในหน้านี้</p>
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

            {/* --- Pagination Controls (ส่วนเพิ่มใหม่) --- */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12 pb-10">
                    {/* ปุ่มย้อนกลับ */}
                    <Link 
                        href={`/dashboard?page=${currentPage - 1}#all-recipes`}
                        className={`p-2 rounded-lg border bg-white hover:bg-orange-50 text-gray-600 transition ${currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}`}
                    >
                        <ChevronLeft size={20} />
                    </Link>

                    {/* เลขหน้า */}
                    <div className="flex gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <Link 
                                key={p} 
                                href={`/dashboard?page=${p}#all-recipes`}
                                className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition shadow-sm
                                    ${p === currentPage 
                                        ? 'bg-orange-500 text-white shadow-orange-200' 
                                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-orange-50 hover:text-orange-600'
                                    }`}
                            >
                                {p}
                            </Link>
                        ))}
                    </div>

                    {/* ปุ่มถัดไป */}
                    <Link 
                        href={`/dashboard?page=${currentPage + 1}#all-recipes`}
                        className={`p-2 rounded-lg border bg-white hover:bg-orange-50 text-gray-600 transition ${currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}`}
                    >
                        <ChevronRight size={20} />
                    </Link>
                </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}