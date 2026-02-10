// src/app/myrecord/page.tsx
import { db } from '@/lib/db'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/session'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import DeleteRecipeButton from '@/components/DeleteRecipeButton'

export default async function MyRecordPage() {
  // 1. ตรวจสอบ Login
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session')?.value
  const session = await decrypt(sessionToken)

  if (!session?.userId) {
    redirect('/login')
  }

  // 2. ดึงสูตรอาหารที่ "ผู้ใช้นี้เป็นคนสร้าง" (authorId ตรงกับ userId เรา)
  const myRecipes = await db.recipe.findMany({
    where: {
      authorId: Number(session.userId)
    },
    orderBy: {
      createdAt: 'desc' // เรียงจากใหม่ไปเก่า
    }
  })

  return (
    <div className="container mx-auto p-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
            <Link 
                href="/profile" 
                className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition text-gray-600"
            >
                ←
            </Link>
            <div>
                <h1 className="text-3xl font-bold text-gray-800">สูตรอาหารของฉัน</h1>
                <p className="text-gray-500">คุณได้แบ่งปันสูตรไปแล้ว {myRecipes.length} รายการ</p>
            </div>
        </div>
        
        <Link href="/recipes/create" className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-600 transition shadow-sm text-sm">
            + เพิ่มสูตรใหม่
        </Link>
      </div>

      {/* Grid แสดงรายการ */}
      {myRecipes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            
            <h3 className="text-xl font-bold text-gray-700">คุณยังไม่ได้เพิ่มสูตรอาหาร</h3>
            <p className="text-gray-500 mb-6"> </p>
            <Link href="/recipes/create" className="bg-orange-500 text-white px-6 py-2 rounded-full font-bold hover:bg-orange-600 transition">
                เริ่มเขียนสูตรแรก
            </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {myRecipes.map((recipe) => (
            <div key={recipe.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition duration-300 border border-gray-100 overflow-hidden group">
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
                            
                        </div>
                    )}
                    <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full shadow font-bold">
                        {recipe.category}
                    </span>
                </div>

                {/* เนื้อหา */}
                <div className="p-4">
                    <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">{recipe.title}</h3>
                    <p className="text-gray-500 text-xs mb-4">
                        สร้างเมื่อ: {new Date(recipe.createdAt).toLocaleDateString('th-TH')}
                    </p>
                    
                    <div className="flex gap-2 mt-4">
                        {/* ปุ่มดูตัวอย่าง */}
                        <Link 
                            href={`/recipes/${recipe.id}`} 
                            className="flex-1 text-center bg-gray-50 text-gray-700 font-bold py-2 rounded border border-gray-200 hover:bg-gray-100 transition text-sm"
                        >
                            ดูตัวอย่าง
                        </Link>
                        
                        {/* ปุ่มแก้ไข */}
                        <Link 
                            href={`/recipes/${recipe.id}/edit`} 
                            className="flex-1 text-center bg-blue-50 text-blue-600 font-bold py-2 rounded border border-blue-200 hover:bg-blue-100 transition text-sm"
                        >
                            แก้ไข
                        </Link>

                        {/* ✅ เพิ่มปุ่มลบตรงนี้ (เป็นปุ่มเล็กๆ ข้างขวาสุด) */}
                        <DeleteRecipeButton  recipeId={recipe.id} />

                    </div>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}