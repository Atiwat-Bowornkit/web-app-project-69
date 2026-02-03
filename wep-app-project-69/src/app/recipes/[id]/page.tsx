import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import RecipeConverter from '@/components/RecipeConverter'
import { cookies } from 'next/headers'    // เพิ่ม
import { decrypt } from '@/lib/session'   // เพิ่ม
// 1. แก้ Type ตรงนี้: params ต้องเป็น Promise
interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function RecipeDetailPage({ params }: PageProps) {
  // 2. แก้ตรงนี้: ต้อง await params ก่อนดึง id ออกมาใช้
  const { id } = await params

  // 3. ใช้ตัวแปร id ที่แกะออกมาแล้ว (ไม่ต้องใช้ params.id)

  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session')?.value
  const session = await decrypt(sessionToken)
  const currentUserId = session?.userId ? Number(session.userId) : undefined
  const recipe = await db.recipe.findUnique({
    where: { 
      id: Number(id) 
    },
    include: {
      author: true, 
      ingredients: {
        include: {
          ingredient: true 
        }
      }
    }
  })

  if (!recipe) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header รูปภาพพื้นหลัง */}
      <div className="relative h-[300px] w-full bg-gray-800">
        {recipe.imageUrl ? (
          <img 
            src={recipe.imageUrl} 
            alt={recipe.title} 
            className="w-full h-full object-cover opacity-80"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-6xl bg-gray-200">
            🍳
          </div>
        )}

        <Link 
          href="/dashboard" 
          className="absolute top-6 left-6 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white px-4 py-2 rounded-full font-bold transition flex items-center gap-2 border border-white/30"
        >
          ← กลับหน้าหลัก
        </Link>
      </div>

      <RecipeConverter recipe={recipe} userId={currentUserId} />
    </div>
  )
}