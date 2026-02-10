// src/app/recipes/[id]/edit/EditRecipeForm.tsx
'use client' // <--- สำคัญมาก! ต้องมีบรรทัดนี้

import { updateRecipe, State } from './actions'
import { useActionState } from 'react'
import Link from 'next/link'

const initialState: State = {
  message: null,
}

// รับข้อมูล recipe ผ่าน Props
export default function EditRecipeForm({ recipe }: { recipe: any }) {
  // ผูก ID เข้ากับ Action ตรงนี้
  const updateRecipeWithId = updateRecipe.bind(null, recipe.id)
  
  // ใช้ Hook เพื่อจัดการ State ของฟอร์ม
  const [state, action, isPending] = useActionState(updateRecipeWithId, initialState)

  // แปลง Ingredients เป็น string เพื่อใส่ใน textarea
  const ingredientsString = recipe.ingredients
    .map((ri: any) => `${ri.ingredient.name}, ${ri.amount}, ${ri.ingredient.unit}`)
    .join('\n')

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">แก้ไขสูตร: {recipe.title}</h1>
        <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">ยกเลิก</Link>
      </div>

      <form action={action} className="space-y-6">
        
        {/* ชื่อเมนู */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">ชื่อเมนู</label>
          <input 
            name="title" 
            type="text" 
            defaultValue={recipe.title} 
            required 
            className="w-full border p-2 rounded text-gray-900" 
          />
        </div>

        {/* หมวดหมู่ & รูปภาพ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block font-medium mb-1 text-gray-700">หมวดหมู่</label>
                <select name="category" defaultValue={recipe.category} className="w-full border p-2 rounded text-gray-900 bg-white">
                    <option value="ผัด">ผัด</option>
                    <option value="ต้ม">ต้ม</option>
                    <option value="ทอด">ทอด</option>
                    <option value="ย่าง">ย่าง</option>
                    <option value="อื่นๆ">อื่นๆ</option>
                </select>
            </div>
            <div>
                 <label className="block font-medium mb-1 text-gray-700">ลิงก์รูปภาพ (URL)</label>
                 <input 
                    name="imageUrl" 
                    type="text" 
                    defaultValue={recipe.imageUrl || ''}
                    className="w-full border p-2 rounded text-gray-900" 
                 />
            </div>
        </div>

        {/* คำอธิบาย */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">คำอธิบายสั้นๆ</label>
          <textarea 
            name="description" 
            rows={2} 
            defaultValue={recipe.description || ''}
            className="w-full border p-2 rounded text-gray-900"
          ></textarea>
        </div>

        {/* วัตถุดิบ */}
        <div className="bg-orange-50 p-4 rounded border border-orange-200">
          <label className="block font-medium mb-1 text-orange-900">วัตถุดิบ (แก้ไขได้)</label>
          <p className="text-xs text-orange-700 mb-2">รูปแบบ: ชื่อ, ปริมาณ, หน่วย</p>
          <textarea 
            name="ingredients" 
            rows={5} 
            defaultValue={ingredientsString}
            className="w-full border p-2 rounded font-mono text-sm text-gray-900"
          ></textarea>
        </div>

        {/* วิธีทำ */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">ขั้นตอนการทำ</label>
          <textarea 
            name="steps" 
            rows={5} 
            defaultValue={recipe.steps}
            required 
            className="w-full border p-2 rounded text-gray-900"
          ></textarea>
        </div>

        {/* แสดง Error ถ้ามี */}
        {state?.message && (
            <div className="bg-red-100 text-red-600 p-3 rounded text-center">
                {state.message}
            </div>
        )}

        {/* ปุ่ม Submit */}
        <button 
          disabled={isPending}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {isPending ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
        </button>
      </form>
    </div>
  )
}