
'use client';
import { useState } from 'react';

export default function ShoppingList() {
  const [items, setItems] = useState([
    { id: 1, name: 'น้ำปลา', checked: false },
    { id: 2, name: 'ใบโหระพา', checked: false },
  ]);

  const toggleItem = (id: number) => {
    setItems(items.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">รายการต้องซื้อ 🛒</h1>
      
      <div className="bg-white rounded-lg shadow divide-y">
        {items.map((item) => (
          <div key={item.id} className="p-4 flex items-center gap-3">
            <input 
              type="checkbox" 
              checked={item.checked}
              onChange={() => toggleItem(item.id)}
              className="w-5 h-5 accent-orange-500"
            />
            <span className={item.checked ? 'text-gray-400 line-through' : ''}>
              {item.name}
            </span>
          </div>
        ))}
      </div>
      
      <button className="mt-6 text-red-500 text-sm hover:underline">ล้างรายการที่ซื้อแล้ว</button>
    </div>
  );
}