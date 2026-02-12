"use client"

import { useState } from 'react'
import { addToTodo } from '@/app/actions/todo' // ✅ 1. เพิ่ม Import

type RecipeData = {
  id: number
  title: string
  servings: number
  steps: string
  imageUrl: string | null
  ingredients: {
    amount: string
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
  const [servings, setServings] = useState(recipe.servings)
  const [isAdding, setIsAdding] = useState(false)


  const handleAddTodo = async () => {
    if (!userId) {
      alert("กรุณาเข้าสู่ระบบก่อนบันทึก")
      return
    }

    setIsAdding(true)

    // ✅ 2. สร้างข้อความที่จะบันทึก
    const todoText = `ซื้อวัตถุดิบทำเมนู "${recipe.title}" (${servings} ที่)`

    await addToTodo(userId, todoText, recipe.id) 
    
    setIsAdding(false)
    alert("เพิ่มลงรายการที่ต้องทำเรียบร้อย")
  } // ✅ 3. ปิดวงเล็บฟังก์ชันตรงนี้

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border overflow-hidden -mt-20 relative z-10 mx-4 md:mx-auto">
      <div className="p-6 md:p-8">
        {/* Header ส่วนชื่อและปุ่มปรับเสิร์ฟ */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">{recipe.title}</h1>
            <p className="text-gray-500 text-sm">โดย{recipe.author.name || 'นิรนาม'}</p>
          </div>

          {/* ปุ่มปรับจำนวนเสิร์ฟ */}
          <div className="flex items-center gap-3 bg-orange-50 p-2 rounded-xl border border-orange-100">
            <button 
              onClick={() => setServings(Math.max(1, servings - 1))}
              className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-orange-600 font-bold hover:bg-orange-100 transition"
            >
              -
            </button>
            <div className="text-center px-2">
               
              <span className="text-xl font-bold text-gray-800 leading-none">{servings}</span>
            </div>
            <button 
              onClick={() => setServings(servings + 1)}
              className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-orange-600 font-bold hover:bg-orange-100 transition"
            >
              +
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* ส่วนวัตถุดิบ */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 pb-2 border-b">
            วัตถุดิบ   
            </h2>
            <ul className="space-y-3">
              {recipe.ingredients.map((item, index) => {
                const displayAmount = item.amount

                return (
                  <li key={index} className="flex justify-between items-center text-gray-700 p-2 hover:bg-gray-50 rounded-lg transition">
                    <span className="font-medium">{item.ingredient.name}</span>
                    <span className="font-bold text-orange-600">
                      {displayAmount} {item.ingredient.unit}
                    </span>
                  </li>
                )
              })}
            </ul>

            <button 
              onClick={handleAddTodo}
              disabled={isAdding}
              className={`mt-6 w-full py-3 rounded-xl font-bold shadow-sm transition flex items-center justify-center gap-2 ${
                isAdding ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
            >
              <span>{isAdding ? "กำลังบันทึก..." : "เพิ่มลงรายการที่ต้องทำ"}</span>
            </button>
          </div>

          {/* ส่วนวิธีทำ */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">วิธีทำ</h2>
            <div className="space-y-6">
              {/* แยกข้อความด้วยการขึ้นบรรทัดใหม่ (\n) */}
              {recipe.steps.split('\n').map((step, index) => (
                step.trim() && (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-sm mt-1">
                      {index + 1}
                    </div>
                    <p className="text-gray-600 leading-relaxed mt-1">{step}</p>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}