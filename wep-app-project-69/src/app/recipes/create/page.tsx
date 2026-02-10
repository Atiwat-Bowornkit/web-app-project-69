'use client'

import { createRecipe, State } from './action'
import { useActionState } from 'react'
import Link from 'next/link'

const initialState: State = {
  message: null,
}

export default function CreateRecipePage() {
  const [state, action, isPending] = useActionState(createRecipe, initialState)

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <div className="flex justify-between items-center mb-6">
        {/* 1. หัวข้อ: เติม text-gray-800 ให้เข้มขึ้น */}
        <h1 className="text-2xl font-bold text-gray-800">🍳 เพิ่มสูตรอาหารใหม่</h1>
        <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">ยกเลิก</Link>
      </div>

      <form action={action} className="space-y-6">
        
        {/* ชื่อเมนู */}
        <div>
          {/* 2. Label: เติม text-gray-700 */}
          <label className="block font-medium mb-1 text-gray-700">ชื่อเมนู <span className="text-red-500">*</span></label>
          {/* 3. Input: เติม text-gray-900 เพื่อให้เวลาพิมพ์เป็นสีเข้ม */}
          <input name="title" type="text" placeholder="เช่น กะเพราไก่ไข่ดาว" required 
            className="w-full border p-2 rounded focus:ring-2 focus:ring-orange-300 outline-none text-gray-900 placeholder-gray-400" 
          />
        </div>

        {/* หมวดหมู่ & รูปภาพ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block font-medium mb-1 text-gray-700">หมวดหมู่</label>
                <select name="category" className="w-full border p-2 rounded text-gray-900 bg-white">
                    <option value="ผัด">ผัด</option>
                    <option value="ต้ม">ต้ม</option>
                    <option value="ทอด">ทอด</option>
                    <option value="ย่าง">ย่าง</option>
                    <option value="อื่นๆ">อื่นๆ</option>
                </select>
            </div>
            <div>
                 <label className="block font-medium mb-1 text-gray-700">ลิงก์รูปภาพ (URL)</label>
                 <input name="imageUrl" type="text" placeholder="https://..." 
                    className="w-full border p-2 rounded text-gray-900 placeholder-gray-400" 
                 />
            </div>
        </div>

        {/* คำอธิบาย */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">คำอธิบายสั้นๆ</label>
          <textarea name="description" rows={2} 
            className="w-full border p-2 rounded text-gray-900 placeholder-gray-400"
          ></textarea>
        </div>

        {/* วัตถุดิบ */}
        <div className="bg-orange-50 p-4 rounded border border-orange-200">
          <label className="block font-medium mb-1 text-orange-900">วัตถุดิบ (บรรทัดละ 1 อย่าง)</label>
          <p className="text-xs text-orange-700 mb-2">รูปแบบ: ชื่อวัตถุดิบ, ปริมาณ, หน่วย (คั่นด้วยลูกน้ำ)</p>
          <textarea 
            name="ingredients" 
            rows={5} 
            placeholder="เนื้อไก่, 200, กรัม&#10;ไข่ไก่, 2, ฟอง&#10;ใบกะเพรา, 1, กำ" 
            className="w-full border p-2 rounded font-mono text-sm text-gray-900 placeholder-gray-400"
          ></textarea>
        </div>

        {/* วิธีทำ */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">ขั้นตอนการทำ <span className="text-red-500">*</span></label>
          <textarea name="steps" rows={5} required placeholder="1. ตั้งกระทะ..." 
            className="w-full border p-2 rounded text-gray-900 placeholder-gray-400"
          ></textarea>
        </div>

        {state?.message && (
          <div className="bg-red-100 text-red-600 p-3 rounded text-center">
            {state.message}
          </div>
        )}

        <button 
          disabled={isPending}
          className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 disabled:bg-gray-400 transition"
        >
          {isPending ? 'กำลังบันทึก...' : 'บันทึกสูตรอาหาร'}
        </button>
      </form>
    </div>
  )
}