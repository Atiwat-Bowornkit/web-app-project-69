// src/app/actions.ts
'use server'

import { deleteSession, decrypt } from '@/lib/session'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function logout() {
  await deleteSession() // ลบ Cookie
  redirect('/login')    // ดีดกลับไปหน้า Login
}

export async function toggleFavorite(recipeId: number) {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session')?.value
  const session = await decrypt(sessionToken)

  if (!session?.userId) return

  const userId = Number(session.userId)

  const existing = await db.favorite.findUnique({
    where: {
      userId_recipeId: {
        userId,
        recipeId
      }
    }
  })

  if (existing) {
    await db.favorite.delete({
      where: { id: existing.id }
    })
  } else {
    await db.favorite.create({
      data: {
        userId,
        recipeId
      }
    })
  }

  revalidatePath('/recipes/[id]', 'page')
  revalidatePath('/myrecord')
  revalidatePath('/profile')
}

export async function deleteRecipe(recipeId: number) {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session')?.value
  const session = await decrypt(sessionToken)
  const userId = Number(session?.userId)

  if (!userId) return

  // 1. ตรวจสอบว่าเป็นเจ้าของสูตรจริงไหม
  const recipe = await db.recipe.findUnique({
    where: { id: recipeId }
  })

  if (!recipe || recipe.authorId !== userId) {
    throw new Error('คุณไม่มีสิทธิ์ลบสูตรนี้')
  }

  // 2. สั่งลบแค่ตัวแม่ (Recipe) ตัวเดียวพอ! 
  // (พวก Favorites, Ingredients, Todos ที่เกาะอยู่จะหายไปเองตามที่เราตั้งค่า Cascade ไว้)
  await db.recipe.delete({
    where: { id: recipeId }
  })

  // 3. รีเฟรชหน้าเว็บ
  revalidatePath('/myrecord')
  revalidatePath('/dashboard')
  revalidatePath('/profile')
}