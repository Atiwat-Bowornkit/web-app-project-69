'use server'

import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/session'
import { revalidatePath } from 'next/cache'

// ❌ ลบ function parseFraction ออก ไม่ต้องใช้แล้วครับ

export type State = {
  message?: string | null
}

export async function updateRecipe(
  id: number,
  prevState: State,
  formData: FormData
): Promise<State> {
  
  // 1. ตรวจสอบสิทธิ์
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

  // 3. อัปเดตข้อมูลสูตร
  await db.recipe.update({
    where: { id },
    data: {
      title,
      description,
      category,
      steps, // เช็คชื่อ field ใน DB ให้ตรง (steps หรือ instructions)
      imageUrl,
    }
  })

  // 4. จัดการวัตถุดิบ (ลบเก่า -> สร้างใหม่)
  if (ingredientsRaw) {
    // ลบของเก่าทิ้งทั้งหมด
    await db.recipeIngredient.deleteMany({
      where: { recipeId: id }
    })

    const lines = ingredientsRaw.split('\n')
    for (const line of lines) {
      const parts = line.split(',')
      if (parts.length >= 1) {
        const name = parts[0].trim()
        if (!name) continue
        
        // ✅ แก้ไขตรงนี้: รับค่าเป็น String ตรงๆ ไม่ต้องแปลง
        // User พิมพ์ "1/2" ก็เก็บ "1/2" เลย
        const amount = parts[1] ? parts[1].trim() : ""
        
        const unit = parts[2]?.trim() || 'หน่วย'

        // หา/สร้าง Ingredient Master
        let ingredient = await db.ingredient.findUnique({ where: { name } })
        if (!ingredient) {
            ingredient = await db.ingredient.create({ data: { name, unit } })
        }
        
        // บันทึกความสัมพันธ์
        await db.recipeIngredient.create({
            data: {
                recipeId: id,
                ingredientId: ingredient.id,
                amount: amount // ส่งค่า String เข้า Database
            }
        })
      }
    }
  }

  revalidatePath(`/recipes/${id}`)
  revalidatePath('/dashboard')

  redirect('/dashboard') 
}