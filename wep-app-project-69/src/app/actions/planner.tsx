// src/app/actions/planner.ts
'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/session'
import { redirect } from 'next/navigation'

// ฟังก์ชันช่วยดึง User ID
async function getUserId() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session')?.value
  const session = await decrypt(sessionToken)
  return session?.userId ? Number(session.userId) : null
}

export async function removeMealFromPlan(planId: number) {
  const userId = await getUserId()
  if (!userId) return

  // ลบข้อมูลโดยเช็คว่าเป็นของ user คนนี้จริงๆ
  await db.mealPlan.deleteMany({
    where: {
      id: planId,
      userId: userId
    }
  })

  revalidatePath('/planner')
}

export async function addMealToPlan(recipeId: number, dateStr: string, slot: string) {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session')?.value
  const session = await decrypt(sessionToken)
  const userId = session?.userId ? Number(session.userId) : null

  if (!userId) return

  const date = new Date(dateStr)

  // ใช้ upsert: ถ้ามีอยู่แล้วให้แก้ ถ้ายังไม่มีให้สร้างใหม่ (ป้องกัน error ข้อมูลซ้ำ)
  // แต่เนื่องจากเราตั้ง @@unique([userId, date, slot]) ไว้ เราต้องใช้ where ที่ตรงเงื่อนไข
  // เพื่อความง่าย เราจะลบของเก่าออกก่อน (ถ้ามี) แล้วสร้างใหม่ หรือใช้ update
  
  // วิธีที่ง่ายและชัวร์สำหรับกรณีนี้คือ ลบแล้วสร้างใหม่ หรือ เช็คก่อน
  const existing = await db.mealPlan.findFirst({
    where: { userId, date, slot }
  })

  if (existing) {
    await db.mealPlan.update({
      where: { id: existing.id },
      data: { recipeId }
    })
  } else {
    await db.mealPlan.create({
      data: {
        userId,
        recipeId,
        date,
        slot
      }
    })
  }

  revalidatePath('/planner')
  redirect('/planner') // บันทึกเสร็จดีดกลับไปหน้าตาราง
}
