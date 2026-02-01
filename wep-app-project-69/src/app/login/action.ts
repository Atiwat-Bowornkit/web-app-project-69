'use server'

import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { createSession } from '@/lib/session'
import { redirect } from 'next/navigation'

export async function loginUser(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // 1. ค้นหา User จาก Email
  const user = await db.user.findUnique({ where: { email } })
  
  // 2. ถ้าไม่เจอ หรือ รหัสผ่านผิด (ใช้ bcrypt.compare)
  if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
    return { message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' }
  }

  // 3. สร้าง Session และบันทึก Cookie
  await createSession(user.id.toString())

  // 4. ไปหน้า Dashboard
  redirect('/dashboard')
}