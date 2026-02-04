'use client'

import { deleteRecipe } from '@/app/actions'
import { useState } from 'react'

export default function DeleteRecipeButton({ recipeId }: { recipeId: number }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    // 1. ถามยืนยันก่อน
    const confirmed = window.confirm('คุณต้องการลบสูตรนี้จริงๆ หรือไม่? \n(การกระทำนี้ไม่สามารถย้อนกลับได้)')
    
    if (confirmed) {
      setIsDeleting(true)
      try {
        await deleteRecipe(recipeId)
        // ลบเสร็จไม่ต้องทำอะไร เดี๋ยว Server Action จะรีเฟรชหน้าให้เอง
      } catch (error) {
        alert('เกิดข้อผิดพลาดในการลบ')
        setIsDeleting(false)
      }
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="bg-red-50 text-red-600 font-bold py-2 px-3 rounded border border-red-200 hover:bg-red-100 transition text-sm flex items-center justify-center gap-1"
      title="ลบสูตรอาหาร"
    >
      {isDeleting ? '...' : '🗑️'}
    </button>
  )
}