'use server'

import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/session'

// 1. เพิ่ม Type State เพื่อให้ TypeScript ไม่ฟ้อง Error
export type State = {
  message?: string | null
}

// 2. ฟังก์ชัน updateRecipe ต้องรับ 3 ค่า เรียงตามนี้เป๊ะๆ
export async function updateRecipe(
  id: number,             // มาจาก .bind (ตัวที่ 1)
  prevState: State,       // มาจาก useActionState (ตัวที่ 2)
  formData: FormData      // ข้อมูลจากฟอร์ม (ตัวที่ 3)
): Promise<State> {
  
  // ตรวจสอบสิทธิ์
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session')?.value
  const session = await decrypt(sessionToken)
  const userId = Number(session?.userId)

  if (!userId) {
    return { message: 'กรุณาเข้าสู่ระบบ' }
  }

  const existingRecipe = await db.recipe.findUnique({ where: { id } })
  
  if (!existingRecipe || existingRecipe.authorId !== userId) {
    return { message: 'คุณไม่มีสิทธิ์แก้ไขสูตรนี้' }
  }

  // รับข้อมูลจากฟอร์ม (ตอนนี้ formData จะไม่ undefined แล้ว)
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const category = formData.get('category') as string
  const steps = formData.get('steps') as string
  const imageUrl = formData.get('imageUrl') as string
  const ingredientsRaw = formData.get('ingredients') as string 

  if (!title || !steps) {
    return { message: 'กรุณากรอกข้อมูลสำคัญให้ครบ' }
  }

  // อัปเดตข้อมูลสูตร
  await db.recipe.update({
    where: { id },
    data: {
      title,
      description,
      category,
      steps,
      imageUrl,
    }
  })

  // จัดการวัตถุดิบ
  if (ingredientsRaw) {
    await db.recipeIngredient.deleteMany({
      where: { recipeId: id }
    })

    const lines = ingredientsRaw.split('\n')
    for (const line of lines) {
      const parts = line.split(',')
      if (parts.length >= 1) {
        const name = parts[0].trim()
        if (!name) continue
        
        const amount = parts[1] ? parts[1].trim() : ""
        const unit = parts[2]?.trim() || 'หน่วย'

        let ingredient = await db.ingredient.findUnique({ where: { name } })
        if (!ingredient) {
            ingredient = await db.ingredient.create({ data: { name, unit } })
        }
        
        await db.recipeIngredient.create({
            data: {
                recipeId: id,
                ingredientId: ingredient.id,
                amount: amount
            }
        })
      }
    }
  }

  // redirect ควรเป็นคำสั่งสุดท้าย
  redirect('/dashboard') 
}