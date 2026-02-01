'use client';
import { useState } from 'react';

export default function RecipeDetail({ params }: { params: { id: string } }) {
  const [servings, setServings] = useState(2); // ค่าเริ่มต้น 2 ที่
  
  // Mock Data (ในความจริงจะดึงจาก DB ตาม params.id)
  const baseIngredients = [
    { name: 'อกไก่', amount: 200, unit: 'กรัม' },
    { name: 'กะทิ', amount: 250, unit: 'มล.' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">แกงเขียวหวานไก่ (Recipe #{params.id})</h1>
      
      {/* Serving Adjuster */}
      <div className="bg-gray-100 p-4 rounded-lg my-6 flex items-center justify-between">
        <span className="font-bold">ปรับจำนวนเสิร์ฟ:</span>
        <div className="flex items-center gap-4">
          <button onClick={() => setServings(Math.max(1, servings - 1))} className="px-3 py-1 bg-white rounded shadow">-</button>
          <span className="text-xl font-bold">{servings} ที่</span>
          <button onClick={() => setServings(servings + 1)} className="px-3 py-1 bg-white rounded shadow">+</button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">วัตถุดิบ</h2>
          <ul className="space-y-2">
            {baseIngredients.map((ing, index) => (
              <li key={index} className="flex justify-between border-b pb-2">
                <span>{ing.name}</span>
                {/* สูตรคำนวณ: (ปริมาณตั้งต้น / 2) * จำนวนเสิร์ฟใหม่ */}
                <span className="font-medium text-orange-600">
                  {(ing.amount / 2 * servings).toFixed(0)} {ing.unit}
                </span>
              </li>
            ))}
          </ul>
          <button className="mt-4 w-full bg-green-600 text-white py-2 rounded">
            + เพิ่มลงรายการซื้อของ
          </button>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">วิธีทำ</h2>
          <ol className="list-decimal pl-5 space-y-4">
            <li>ตั้งกระทะใส่กะทิผัดกับพริกแกงจนหอม</li>
            <li>ใส่เนื้อไก่ลงไปผัดจนสุก</li>
          </ol>
        </div>
      </div>
    </div>
  );
}