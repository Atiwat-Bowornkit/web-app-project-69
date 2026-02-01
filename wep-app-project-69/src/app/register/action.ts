'use server'

import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'

export async function registerUser(prevState: any, formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // 1. เช็คว่ามีอีเมลนี้หรือยัง
  const existingUser = await db.user.findUnique({ where: { email } })
  if (existingUser) {
    return { message: 'อีเมลนี้ถูกใช้งานแล้ว' }
  }

  // 2. เข้ารหัสรหัสผ่าน (สำคัญมาก!)
  const hashedPassword = await bcrypt.hash(password, 10)

  // 3. สร้าง User ใหม่
  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  })

  // 4. ส่งไปหน้า Login
  redirect('/login')
}