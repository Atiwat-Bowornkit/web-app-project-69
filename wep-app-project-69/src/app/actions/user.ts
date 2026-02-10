// src/app/actions/user.ts
"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { hash } from "bcryptjs" // ใช้สำหรับเข้ารหัสรหัสผ่าน

export async function updateProfile(userId: number, formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const image = formData.get("image") as string

  try {
    const updateData: any = {
      name,
      email,
      image,
    }

    // ถ้ามีการกรอกรหัสผ่านใหม่ ให้ทำการเข้ารหัสและอัปเดต
    if (password && password.trim() !== "") {
      const hashedPassword = await hash(password, 10)
      updateData.password = hashedPassword
    }

    await db.user.update({
      where: { id: userId },
      data: updateData,
    })

    revalidatePath("/profile") // รีเฟรชหน้า Profile
    return { success: true }
  } catch (error) {
    console.error("Update Profile Error:", error)
    return { success: false, error: "ไม่สามารถอัปเดตข้อมูลได้" }
  }
}