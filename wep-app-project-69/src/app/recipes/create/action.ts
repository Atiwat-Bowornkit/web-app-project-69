'use server'

import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/session'

// 1. กำหนดหน้าตาของข้อมูลที่จะส่งกลับ (สำคัญมากสำหรับ TypeScript)
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

  const newRecipe = await db.recipe.create({
    data: {
      title,
      description,
      category,
      steps,
      imageUrl,
      authorId: Number(session.userId),
    }
  })

  if (ingredientsRaw) {
    const lines = ingredientsRaw.split('\n')
    for (const line of lines) {
      const parts = line.split(',')
      if (parts.length >= 1) {
        const name = parts[0].trim()
        if (!name) continue
        
        const amount = parts[1] ? parseFloat(parts[1].trim()) : 1
        const unit = parts[2]?.trim() || 'หน่วย'

        let ingredient = await db.ingredient.findUnique({ where: { name } })
        if (!ingredient) {
            ingredient = await db.ingredient.create({ data: { name, unit } })
        }
        
        await db.recipeIngredient.create({
            data: {
                recipeId: newRecipe.id,
                ingredientId: ingredient.id,
                amount: amount
            }
        })
      }
    }
  }

  redirect('/dashboard')
}