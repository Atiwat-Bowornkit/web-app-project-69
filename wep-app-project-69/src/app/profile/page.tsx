// src/app/profile/page.tsx
import { db } from '@/lib/db'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/session'
import { redirect } from 'next/navigation'
import { logout } from '@/app/actions'
import Link from 'next/link'
import TodoItem from '@/components/TodoItem'

export default async function ProfilePage() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session')?.value
  const session = await decrypt(sessionToken)

  if (!session?.userId) {
    redirect('/login')
  }

  // 1. ดึงข้อมูล User รวมถึง Favorites, Todos และ **Recipes (สูตรของฉัน)**
  const user = await db.user.findUnique({
    where: { id: Number(session.userId) },
    include: {
      favorites: {
        include: {
          recipe: {
            include: { author: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      },
      todos: {
        orderBy: { createdAt: 'desc' }
      },
      recipes: true // <--- เพิ่มตรงนี้! เพื่อดึงสูตรที่ User เป็นคนสร้าง
    }
  })

  if (!user) return <div>ไม่พบข้อมูลผู้ใช้</div>

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      {/* Header Profile */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-3xl">
                👤
            </div>
            <div>
                <h1 className="text-2xl font-bold text-gray-800">สวัสดี, {user.name}! 👋</h1>
                <p className="text-gray-500 text-sm">{user.email}</p>
            </div>
        </div>
        
        <form action={logout}>
          <button className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 px-6 py-2 rounded-full text-sm font-bold transition flex items-center gap-2">
            <span>🚪</span> ออกจากระบบ
          </button>
        </form>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Card 1: My Recipes (สูตรของฉัน) */}
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm">
          <h3 className="font-bold text-blue-800 text-lg mb-2">📚 สูตรของฉัน (My Record)</h3>
          <p className="text-4xl font-bold text-blue-600">
            {/* แก้ตรงนี้: เปลี่ยนจาก user.favorites.length เป็น user.recipes.length */}
            {user.recipes.length} <span className="text-base font-normal text-gray-500">สูตร 
            <Link href="/myrecord" className="ml-2 text-sm text-orange-500 font-bold hover:underline seeRecord">
              ดูทั้งหมด →
            </Link></span>
          </p>
        </div>

        {/* Card 2: To-Dos */}
        <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 shadow-sm">
          <h3 className="font-bold text-purple-800 text-lg mb-2">📝 รายการที่ต้องทำ</h3>
          <p className="text-4xl font-bold text-purple-600">
            {user.todos.length} <span className="text-base font-normal text-gray-500">รายการ</span>
          </p>
        </div>
      </div>

      {/* Section 1: Favorites (ยังคงแสดงรายการที่กดหัวใจไว้ด้านล่างเหมือนเดิม) */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
            ❤️ รายการที่ถูกใจ (Favorites)
        </h2>
        
        {user.favorites.length === 0 ? (
          <div className="p-12 bg-gray-50 text-center rounded-xl border-2 border-dashed border-gray-300">
              <p className="text-gray-500 mb-2">คุณยังไม่มีสูตรอาหารที่ถูกใจ</p>
              <Link href="/dashboard" className="text-orange-500 font-bold hover:underline">
                สำรวจสูตรอาหารเลย →
              </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.favorites.map((fav) => (
              <div key={fav.id} className="bg-white rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition">
                <div className="h-40 bg-gray-100 relative">
                  {fav.recipe.imageUrl ? (
                    <img src={fav.recipe.imageUrl} alt={fav.recipe.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">🍳</div>
                  )}
                  <span className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] px-2 py-1 rounded-full font-bold">
                    {fav.recipe.category}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 truncate mb-1">{fav.recipe.title}</h3>
                  <p className="text-xs text-gray-400 mb-4">โดย {fav.recipe.author.name}</p>
                  <Link 
                    href={`/recipes/${fav.recipe.id}`}
                    className="block text-center w-full py-2 bg-gray-50 text-orange-600 text-sm font-bold rounded hover:bg-orange-50 transition border border-gray-100"
                  >
                    ดูวิธีทำ
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section 2: To-Do List */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
            ✅ รายการที่ต้องทำของคุณ ({user.todos.length})
        </h2>
        
        {user.todos.length === 0 ? (
          <div className="p-12 bg-white text-center rounded-xl border border-gray-200 shadow-sm">
              <div className="text-4xl mb-3">📝</div>
              <p className="text-gray-500">คุณยังไม่มีรายการที่ต้องทำในขณะนี้</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            {user.todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}