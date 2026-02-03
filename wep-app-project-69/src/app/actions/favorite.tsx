"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

// หมายเหตุ: userId ควรรับเป็น number ตาม Schema ล่าสุดที่เราแก้กันไป
export async function toggleFavorite(recipeId: number, userId: number) {
  try {
    // 1. ตรวจสอบว่าเคยกดถูกใจไว้หรือยัง
    // แก้ db.Favorite -> db.favorite (ตัวพิมพ์เล็ก)
    const existingFavorite = await db.favorite.findUnique({
      where: {
        // แก้ user_recipeId -> userId_recipeId (ตามชื่อฟิลด์ใน Schema)
        userId_recipeId: { 
            userId, 
            recipeId 
        }
      }
    })

    if (existingFavorite) {
      // 2. ถ้ามีอยู่แล้ว ให้ลบออก (Unlike)
      await db.favorite.delete({
        where: { id: existingFavorite.id }
      })
    } else {
      // 3. ถ้ายังไม่มี ให้สร้างใหม่ (Like)
      await db.favorite.create({
        data: { userId, recipeId }
      })
    }

    revalidatePath("/dashboard")
    revalidatePath("/profile")

    return { success: true }
  } catch (error) {
    console.error("Database Error:", error)
    return { success: false, error: "Failed to update favorite" }
  }
}