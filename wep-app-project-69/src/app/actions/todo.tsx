"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

// ฟังก์ชันลบรายการ
export async function deleteTodo(todoId: number) {
  try {
    await db.todo.delete({
      where: { id: todoId }
    })
    revalidatePath('/profile') // สั่งให้หน้า Profile โหลดข้อมูลใหม่ทันที
    return { success: true }
  } catch (error) {
    console.error("Delete Error:", error)
    return { success: false, error: "Failed to delete" }
  }
}

// ฟังก์ชันเปลี่ยนสถานะ (Done / Not Done)
export async function toggleTodo(todoId: number, isDone: boolean) {
  try {
    await db.todo.update({
      where: { id: todoId },
      data: { isDone }
    })
    revalidatePath('/profile')
    return { success: true }
  } catch (error) {
    console.error("Toggle Error:", error)
    return { success: false }
  }
}

// ฟังก์ชันเพิ่มรายการ (ต้องรองรับ recipeId)
export async function addToTodo(userId: number, text: string, recipeId?: number) {
  try {
    await db.todo.create({
      data: {
        userId,
        text,
        recipeId, // บันทึก ID สูตรลงไป
      }
    })
    revalidatePath('/profile')
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to add todo" }
  }
}