"use client"

import { useState } from 'react'
import { Trash2, ExternalLink, CheckCircle, Circle } from 'lucide-react'
import { deleteTodo, toggleTodo } from '@/app/actions/todo' // เราจะสร้างไฟล์นี้ในขั้นตอนถัดไป
import Link from 'next/link'

type TodoItemProps = {
  todo: {
    id: number
    text: string
    isDone: boolean
    recipeId: number | null
    createdAt: Date
  }
}

export default function TodoItem({ todo }: TodoItemProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDone, setIsDone] = useState(todo.isDone)

  // ฟังก์ชันลบรายการ
  const handleDelete = async () => {
    if (!confirm("ยืนยันที่จะลบรายการนี้?")) return
    setIsDeleting(true)
    await deleteTodo(todo.id)
    setIsDeleting(false)
  }

  // ฟังก์ชันกดติ๊กถูก (ทำเสร็จแล้ว)
  const handleToggle = async () => {
    const newState = !isDone
    setIsDone(newState) // เปลี่ยนสีทันที (Optimistic Update)
    await toggleTodo(todo.id, newState)
  }

  return (
    <div className={`p-4 border-b last:border-0 flex items-center justify-between gap-3 hover:bg-gray-50 transition duration-200 ${isDeleting ? 'opacity-50' : ''}`}>
      
      {/* ส่วนซ้าย: ปุ่มติ๊กถูก + ข้อความ */}
      <div className="flex items-center gap-3 flex-1 overflow-hidden">
        <button 
          onClick={handleToggle} 
          className="flex-shrink-0 text-gray-400 hover:text-purple-600 transition"
        >
          {isDone ? (
            <CheckCircle className="w-6 h-6 text-green-500" />
          ) : (
            <Circle className="w-6 h-6" />
          )}
        </button>
        
        <div className="flex-1 min-w-0">
            <p className={`text-gray-800 font-medium truncate ${isDone ? "line-through text-gray-400" : ""}`}>
                {todo.text}
            </p>
            <p className="text-[10px] text-gray-400">
                {new Date(todo.createdAt).toLocaleDateString('th-TH', { 
                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                })}
            </p>
        </div>
      </div>

      {/* ส่วนขวา: ปุ่ม Action */}
      <div className="flex items-center gap-1">
        {/* 1. ปุ่มดูรายละเอียด (แสดงเฉพาะเมื่อมี recipeId เชื่อมอยู่) */}
        {todo.recipeId && (
          <Link 
            href={`/recipes/${todo.recipeId}`}
            className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition tooltip-trigger"
            title="ดูสูตรอาหาร"
          >
            <ExternalLink size={18} />
          </Link>
        )}

        {/* 2. ปุ่มลบรายการ */}
        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
          title="ลบรายการ"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  )
}