// src/components/EditProfileModal.tsx
"use client"

import { useState } from "react"
import { Pencil, X, Save, Loader2 } from "lucide-react"
import { updateProfile } from "@/app/actions/user"

type UserData = {
  id: number
  name: string | null
  email: string
  image: string | null
}

export default function EditProfileModal({ user }: { user: UserData }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const result = await updateProfile(user.id, formData)

    if (result.success) {
      alert("อัปเดตข้อมูลสำเร็จ")
      setIsOpen(false)
    } else {
      alert("เกิดข้อผิดพลาด: " + result.error)
    }
    setIsLoading(false)
  }

  return (
    <>
      {/* ปุ่มกดเพื่อเปิด Modal */}
      <button 
        onClick={() => setIsOpen(true)}
        className="text-gray-400 hover:text-orange-500 transition p-2 rounded-full hover:bg-orange-50"
        title="แก้ไขโปรไฟล์"
      >
        <Pencil size={20} />
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b bg-gray-50">
              <h3 className="font-bold text-lg text-gray-800">แก้ไขข้อมูลส่วนตัว</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              {/* ชื่อ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อที่แสดง (Name)</label>
                <input 
                  type="text" 
                  name="name" 
                  defaultValue={user.name || ""} 
                  required
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              {/* อีเมล (Username) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล / Username</label>
                <input 
                  type="email" 
                  name="email" 
                  defaultValue={user.email} 
                  required
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              {/* รูปโปรไฟล์ (URL) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ลิงก์รูปโปรไฟล์ (URL)</label>
                <input 
                  type="url" 
                  name="image" 
                  defaultValue={user.image || ""} 
                  placeholder="https://example.com/my-image.jpg"
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500 outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">*ใส่ลิงก์รูปภาพจากเว็บอื่น</p>
              </div>

              {/* รหัสผ่านใหม่ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">เปลี่ยนรหัสผ่าน (ถ้าต้องการ)</label>
                <input 
                  type="password" 
                  name="password" 
                  placeholder="เว้นว่างไว้หากไม่ต้องการเปลี่ยน"
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 pt-4 border-t">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition"
                >
                  ยกเลิก
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex-1 py-2 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                  บันทึก
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  )
}