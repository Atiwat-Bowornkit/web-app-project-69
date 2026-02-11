'use server'

import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/session'


export type State = {
  message?: string | null
}

export async function createRecipe(prevState: State, formData: FormData): Promise<State> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session')?.value
  const session = await decrypt(sessionToken)

  if (!session?.userId) {
    return { message: 'กรุณาเข้าสู่ระบบก่อน' }
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const category = formData.get('category') as string
  const steps = formData.get('steps') as string
  const imageUrl = formData.get('imageUrl') as string
  const ingredientsRaw = formData.get('ingredients') as string 

  if (!title || !steps) {
    return { message: 'กรุณากรอกชื่อเมนูและวิธีทำ' }
  }

  // สร้าง Recipe หลัก
  const newRecipe = await db.recipe.create({
    data: {
      title,
      description,
      category,
      steps: steps, // อย่าลืมเช็ค schema ว่าใช้ 'steps' หรือ 'instructions'
      imageUrl,
      authorId: Number(session.userId),
    }
  })

  // จัดการ Ingredients
  if (ingredientsRaw) {
    const lines = ingredientsRaw.split('\n')
    for (const line of lines) {
      const parts = line.split(',')
      
      if (parts.length >= 1) {
        const name = parts[0].trim()
        if (!name) continue 
        
        // ✅ แก้ไขตรงนี้: รับค่าเป็น String ตรงๆ ไม่ต้องคำนวณ
        // ถ้า user พิมพ์ "1/2" ก็จะได้ "1/2"
        // ถ้า user พิมพ์ "นิดหน่อย" ก็จะได้ "นิดหน่อย"
        const amount = parts[1] ? parts[1].trim() : "" 
        
        const unit = parts[2]?.trim() || 'หน่วย'

        // ค้นหาหรือสร้าง Ingredient (Master Data)
        let ingredient = await db.ingredient.findUnique({ where: { name } })
        if (!ingredient) {
            ingredient = await db.ingredient.create({ data: { name, unit } })
        }
        
        // บันทึกลงตารางกลาง
        await db.recipeIngredient.create({
            data: {
                recipeId: newRecipe.id,
                ingredientId: ingredient.id,
                amount: amount // ตอนนี้ database ต้องเป็น String นะครับถึงจะผ่าน
            }
        })
      }
    }
  }

  redirect('/dashboard')
}