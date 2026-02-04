// src/app/recipes/[id]/edit/page.tsx
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/session'
import EditRecipeForm from './EditRecipeForm' // <--- 1. Import Component ที่เราเพิ่งสร้าง

export default async function EditRecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: paramId } = await params 
  const id = Number(paramId)

  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session')?.value
  const session = await decrypt(sessionToken)
  const userId = Number(session?.userId)

  const recipe = await db.recipe.findUnique({
    where: { id },
    include: {
      ingredients: {
        include: { ingredient: true }
      }
    }
  })

  if (!recipe || recipe.authorId !== userId) {
    redirect('/dashboard')
  }

  // 2. ส่งต่อข้อมูล recipe ไปให้ Client Component จัดการ
  return <EditRecipeForm recipe={recipe} />
}