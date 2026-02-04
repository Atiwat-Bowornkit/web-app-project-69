'use server'

import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/session'

export async function updateRecipe(id: number, prevState: any, formData: FormData) {
  // 1. ตรวจสอบสิทธิ์ (ต้องเป็นคนแต่งเท่านั้นถึงแก้ได้)
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session')?.value
  const session = await decrypt(sessionToken)
  const userId = Number(session?.userId)

  const existingRecipe = await db.recipe.findUnique({ where: { id } })
  
  if (!existingRecipe || existingRecipe.authorId !== userId) {
    return { message: 'คุณไม่มีสิทธิ์แก้ไขสูตรนี้' }
  }

  // 2. รับข้อมูลจากฟอร์ม
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const category = formData.get('category') as string
  const steps = formData.get('steps') as string
  const imageUrl = formData.get('imageUrl') as string
  const ingredientsRaw = formData.get('ingredients') as string 

  if (!title || !steps) {
    return { message: 'กรุณากรอกข้อมูลสำคัญให้ครบ' }
  }

  // 3. อัปเดตข้อมูลสูตร (Recipe)
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

  // 4. จัดการวัตถุดิบ (วิธีง่ายสุด: ลบของเก่าทิ้ง แล้วสร้างใหม่ตามที่พิมพ์มา)
  if (ingredientsRaw) {
    // ลบความสัมพันธ์วัตถุดิบเก่าออกก่อน
    await db.recipeIngredient.deleteMany({
      where: { recipeId: id }
    })

    const lines = ingredientsRaw.split('\n')
    for (const line of lines) {
      const parts = line.split(',')
      if (parts.length >= 1) {
        const name = parts[0].trim()
        if (!name) continue
        
        const amount = parts[1] ? parseFloat(parts[1].trim()) : 1
        const unit = parts[2]?.trim() || 'หน่วย'

        // หาหรือสร้าง Ingredient Master
        let ingredient = await db.ingredient.findUnique({ where: { name } })
        if (!ingredient) {
            ingredient = await db.ingredient.create({ data: { name, unit } })
        }
        
        // สร้างความสัมพันธ์ใหม่
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

  redirect(`/myrecord`) // แก้เสร็จกลับไปหน้า My Record
}