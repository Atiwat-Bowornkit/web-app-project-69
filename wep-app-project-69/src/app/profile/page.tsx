// src/app/profile/page.tsx
import { db } from '@/lib/db'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/session'
import { redirect } from 'next/navigation'
import { logout } from '@/app/actions' 

export default async function ProfilePage() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session')?.value
  const session = await decrypt(sessionToken)

  if (!session?.userId) {
    redirect('/login')
  }

  const user = await db.user.findUnique({
    where: { id: Number(session.userId) }
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
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm">
          <h3 className="font-bold text-blue-800 text-lg mb-2">📚 สูตรที่บันทึกไว้</h3>
          <p className="text-4xl font-bold text-blue-600">0 <span className="text-base font-normal text-gray-500">สูตร</span></p>
        </div>
        <div className="bg-red-50 p-6 rounded-xl border border-red-100 shadow-sm">
          <h3 className="font-bold text-red-800 text-lg mb-2">⚠️ แจ้งเตือนวัตถุดิบ</h3>
          <p className="text-sm text-gray-600">ยังไม่มีรายการแจ้งเตือน</p>
        </div>
      </div>

      {/* Inventory Suggestion */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
            🥦 เมนูแนะนำจากของในตู้เย็น
        </h2>
        <div className="p-12 bg-gray-50 text-center rounded-xl border-2 border-dashed border-gray-300">
            <p className="text-gray-500">ระบบนี้รอเชื่อมต่อกับคลังวัตถุดิบของคุณ...</p>
        </div>
      </section>
    </div>
  )
}