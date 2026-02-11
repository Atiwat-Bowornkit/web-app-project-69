"use client"

import { useState } from 'react'
import { addToTodo } from '@/app/actions/todo'
import { ShoppingCart } from 'lucide-react'

type RecipeData = {
  id: number
  title: string
  servings: number
  steps: string
  imageUrl: string | null
  ingredients: {
    amount: number
    ingredient: {
      name: string
      unit: string
    }
  }[]
  author: {
    name: string | null
  }
}

export default function RecipeConverter({ recipe, userId }: { recipe: RecipeData, userId?: number }) {
  // ไม่ต้องมี State เรื่อง Servings แล้ว เพราะเราจะโชว์ตามจริง
  const [isAdding, setIsAdding] = useState(false)

  const handleAddTodo = async () => {
    if (!userId) {
      alert("กรุณาเข้าสู่ระบบก่อนบันทึก")
      return
    }

    setIsAdding(true)

    // ใช้ recipe.servings ตามจริงที่บันทึกมา
    const todoText = `ซื้อวัตถุดิบทำเมนู "${recipe.title}" (${recipe.servings} ที่)`

    await addToTodo(userId, todoText, recipe.id) 
    
    setIsAdding(false)
    alert("✅ เพิ่มลงรายการที่ต้องทำเรียบร้อย!")
  } 

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg -mt-20 relative z-10 border border-gray-100">
      
      {/* ส่วนหัวข้อ และ จำนวนที่บริโภค (แบบ Fix) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 mb-6">
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{recipe.title}</h1>
            <div className="flex items-center gap-2 text-gray-500">
                <span>🍽️ สำหรับ: <b>{recipe.servings}</b> ที่</span>
                <span>•</span>
                <span>👨‍🍳 โดย: {recipe.author.name || 'ไม่ระบุ'}</span>
            </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* ส่วนวัตถุดิบ (แสดงตามจริง ไม่มีการคำนวณ) */}
        <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
          <h2 className="text-xl font-bold text-orange-800 mb-4 flex items-center gap-2">
            🥕 วัตถุดิบ
          </h2>
          
          <ul className="space-y-3">
            {recipe.ingredients.map((item, index) => (
              <li key={index} className="flex justify-between items-center text-gray-700 border-b border-orange-200/50 pb-2 last:border-0">
                <span className="font-medium">{item.ingredient.name}</span>
                <span className="font-bold text-orange-600 bg-white px-2 py-0.5 rounded shadow-sm">
                  {/* แสดงตัวเลขดิบๆ จาก Database เลย */}
                  {item.amount} {item.ingredient.unit}
                </span>
              </li>
            ))}
          </ul>

          {/* ปุ่มเพิ่มลง Todo List */}
          <button 
            onClick={handleAddTodo}
            disabled={isAdding}
            className={`mt-6 w-full py-3 rounded-xl font-bold shadow-sm transition flex items-center justify-center gap-2 ${
              isAdding ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700 text-white"
            }`}
          >
            <ShoppingCart size={20} />
            <span>{isAdding ? "กำลังบันทึก..." : "จดรายการต้องทำ"}</span>
          </button>
        </div>

        {/* ส่วนวิธีทำ */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b flex items-center gap-2">
            🔥 วิธีทำ
          </h2>
          <div className="space-y-6">
            {recipe.steps.split('\n').map((step, index) => (
              step.trim() && (
                <div key={index} className="flex gap-4 group">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-100 text-gray-500 group-hover:bg-orange-500 group-hover:text-white rounded-full flex items-center justify-center font-bold text-sm mt-1 transition-colors">
                    {index + 1}
                  </div>
                  <p className="text-gray-600 leading-relaxed mt-1">
                    {step}
                  </p>
                </div>
              )
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}