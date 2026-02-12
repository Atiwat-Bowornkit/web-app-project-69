// src/app/profile/page.tsx
import { db } from '@/lib/db'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/session'
import { redirect } from 'next/navigation'
import { logout } from '@/app/actions'
import Link from 'next/link'
import TodoItem from '@/components/TodoItem'
import EditProfileModal from '@/components/EditProfileModal'

// ✅ 1. เพิ่มบรรทัดนี้: นำเข้าปุ่มลบที่เราเพิ่งสร้าง
import RemoveFavoriteBtn from '@/components/remove-favorite-btn'

export default async function ProfilePage() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session')?.value
  const session = await decrypt(sessionToken)

  if (!session?.userId) {
    redirect('/login')
  }

  // ดึงข้อมูล User
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
      recipes: true
    }
  })

  if (!user) return <div>ไม่พบข้อมูลผู้ใช้</div>

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      {/* ... (ส่วน Header และ Stats เหมือนเดิม ไม่ต้องแก้) ... */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-3xl overflow-hidden border-2 border-orange-200">
                {user.image ? (
                  <img src={user.image} alt={user.name || "User"} className="w-full h-full object-cover" />
                ) : (
                  <span>👤</span>
                )}
            </div>
            <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
                  <EditProfileModal user={user} />
                </div>
                <p className="text-gray-500 text-sm">{user.email}</p>
            </div>
        </div>
        
        <form action={logout}>
          <button className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 px-6 py-2 rounded-full text-sm font-bold transition flex items-center gap-2">
            ออกจากระบบ
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
         <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm">
          <h3 className="font-bold text-blue-800 text-lg mb-2">สูตรของฉัน</h3>
          <p className="text-4xl font-bold text-blue-600">
            {user.recipes.length} <span className="text-base font-normal text-gray-500">สูตร 
            <Link href="/myrecord" className="ml-2 text-sm text-orange-500 font-bold hover:underline seeRecord">
              ดูทั้งหมด →
            </Link></span>
          </p>
        </div>

        <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 shadow-sm">
          <h3 className="font-bold text-purple-800 text-lg mb-2">รายการที่ต้องทำ</h3>
          <p className="text-4xl font-bold text-purple-600">
            {user.todos.length} <span className="text-base font-normal text-gray-500">รายการ</span>
          </p>
        </div>
      </div>

      <section className="mb-10">
        <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          รายการที่ถูกใจ
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
              <div key={fav.id} className="bg-white rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition flex flex-col h-full">
                {/* Image */}
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

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-gray-800 truncate mb-1">{fav.recipe.title}</h3>
                  <p className="text-xs text-gray-400 mb-4">โดย {fav.recipe.author.name}</p>
                  
                  {/* ✅ 2. แก้ไขส่วนปุ่มกด: จัดให้ปุ่มดูสูตร กับ ปุ่มลบ อยู่คู่กัน */}
                  <div className="mt-auto flex items-center gap-2">
                    <Link 
                      href={`/recipes/${fav.recipe.id}`}
                      className="flex-1 text-center py-2 bg-gray-50 text-orange-600 text-sm font-bold rounded hover:bg-orange-50 transition border border-gray-100"
                    >
                      ดูวิธีทำ
                    </Link>
                    
                    {/* ปุ่มลบที่เรา Import มา */}
                    <RemoveFavoriteBtn recipeId={fav.recipe.id} />
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
            รายการที่ต้องทำของคุณ 
        </h2>
        {user.todos.length === 0 ? (
          <div className="p-12 bg-white text-center rounded-xl border border-gray-200 shadow-sm">
              <div className="text-4xl mb-3"></div>
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