import { db } from '@/lib/db'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/session'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
  // 1. ดึง Session ออกมาจาก Cookie
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session')?.value
  const session = await decrypt(sessionToken)

  // ถ้าไม่มี Session ให้ดีดไปหน้า Login (จริงๆ Middleware กันไว้แล้ว แต่กันเหนียว)
  if (!session?.userId) {
    redirect('/login')
  }

  // 2. ค้นหาข้อมูล User จริงๆ จาก Database โดยใช้ ID ใน Session
  const user = await db.user.findUnique({
    where: { id: Number(session.userId) }
  })

  // ถ้าหาไม่เจอ (กรณีแปลกๆ)
  if (!user) return <div>ไม่พบข้อมูลผู้ใช้</div>

  return (
    <div className="p-6">
      {/* ตรงนี้จะเปลี่ยนเป็นชื่อจริงตามที่ล็อกอินแล้วครับ */}
      <h1 className="text-2xl font-bold mb-6">สวัสดี, {user.name}! 👋</h1>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="font-bold text-blue-800">สูตรที่บันทึกไว้</h3>
          <p className="text-2xl">0 สูตร</p> {/* เดี๋ยวค่อยมาแก้ให้นับจริง */}
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
          <h3 className="font-bold text-red-800">แจ้งเตือนวัตถุดิบ</h3>
          <p className="text-sm">ยังไม่มีรายการแจ้งเตือน</p>
        </div>
      </div>

      {/* Recommendations based on Inventory */}
      <section>
        <h2 className="text-xl font-bold mb-4">เมนูแนะนำจากของในตู้เย็น 🥦</h2>
        <div className="p-8 bg-gray-50 text-center rounded border border-dashed">
            <p className="text-gray-500">ระบบนี้รอเชื่อมต่อกับคลังวัตถุดิบของคุณ...</p>
        </div>
      </section>
    </div>
  )
}