import { db } from '@/lib/db'
import { updateRecipe } from './actions'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/session'

// 1. แก้ Type ตรงนี้ให้เป็น Promise
export default async function EditRecipePage({ params }: { params: Promise<{ id: string }> }) {
  
  // 2. ต้อง await params ก่อน ถึงจะดึง id ออกมาได้
  const { id: paramId } = await params 
  const id = Number(paramId)

  // ส่วนข้างล่างเหมือนเดิมครับ
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session')?.value
  const session = await decrypt(sessionToken)
  const userId = Number(session?.userId)

  // 3. ตอนนี้ตัวแปร id จะมีค่าถูกต้องแล้ว เอาไป query ได้เลย
  const recipe = await db.recipe.findUnique({
    where: { id },
    include: {
      ingredients: {
        include: { ingredient: true }
      }
    }
  })

  // ... (โค้ดส่วนเช็คสิทธิ์และ return เหมือนเดิมทุกอย่าง)
  if (!recipe || recipe.authorId !== userId) {
    redirect('/dashboard')
  }

  const ingredientsString = recipe.ingredients
    .map(ri => `${ri.ingredient.name}, ${ri.amount}, ${ri.ingredient.unit}`)
    .join('\n')

  const updateRecipeWithId = updateRecipe.bind(null, id)

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">✏️ แก้ไขสูตร: {recipe.title}</h1>
        <Link href="/myrecord" className="text-gray-500 hover:text-gray-700">ยกเลิก</Link>
      </div>

      <form action={updateRecipeWithId} className="space-y-6">
        
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block font-medium mb-1 text-gray-700">หมวดหมู่</label>
                <select name="category" defaultValue={recipe.category} className="w-full border p-2 rounded text-gray-900 bg-white">
                    <option value="ผัด">ผัด</option>
                    <option value="ต้ม">ต้ม / แกง</option>
                    <option value="ทอด">ทอด</option>
                    <option value="ย่าง">ย่าง / อบ</option>
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

        <div>
          <label className="block font-medium mb-1 text-gray-700">คำอธิบายสั้นๆ</label>
          <textarea 
            name="description" 
            rows={2} 
            defaultValue={recipe.description || ''}
            className="w-full border p-2 rounded text-gray-900"
          ></textarea>
        </div>

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

        <button 
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
        >
          บันทึกการแก้ไข
        </button>
      </form>
    </div>
  )
}