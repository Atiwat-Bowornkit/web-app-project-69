"use client"

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { toggleFavorite } from '@/app/actions/favorite' // ดึง Server Action มาใช้

interface FavoriteButtonProps {
  recipeId: number
  userId: number | string // รับได้ทั้งคู่ แต่ตอนส่งไป Server จะแปลงเป็น Number
  initialIsFavorite?: boolean // เพิ่มตัวนี้ เพื่อเช็คว่าเคยไลก์หรือยังตอนโหลดหน้า
}

export default function FavoriteButton({ 
  recipeId, 
  userId, 
  initialIsFavorite = false 
}: FavoriteButtonProps) {
  
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault() // ป้องกันไม่ให้ลิงก์ของ Card ทำงาน
    if (isLoading) return

    // 1. Optimistic Update: เปลี่ยนสีที่หน้าจอก่อนเลยเพื่อความลื่นไหล
    const newState = !isFavorite
    setIsFavorite(newState)
    setIsLoading(true)

    try {
      // 2. ส่งข้อมูลไปบันทึกลง Database
      // แปลง userId เป็น number ให้ชัวร์ก่อนส่ง
      await toggleFavorite(recipeId, Number(userId))
    } catch (error) {
      // 3. ถ้า Error ให้เปลี่ยนสีกลับคืน
      setIsFavorite(!newState)
      console.error("Error toggling favorite:", error)
      alert("เกิดข้อผิดพลาดในการบันทึก")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button 
      onClick={handleToggle}
      disabled={isLoading}
      className="absolute top-3 left-3 z-10 p-2 bg-white/90 rounded-full shadow-md hover:scale-110 transition-transform active:scale-95"
    >
      <Heart 
        size={20} 
        className={`transition-colors duration-300 ${
          isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
        }`} 
      />
    </button>
  )
}