'use client'

import { registerUser } from './action' // เดี๋ยวสร้างไฟล์นี้ในขั้นตอนถัดไป
import Link from 'next/link'
import { useActionState } from 'react'

export default function RegisterPage() {
  const [state, action, isPending] = useActionState(registerUser, undefined)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">สมัครสมาชิกใหม่</h2>
        
        <form action={action} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">ชื่อผู้ใช้</label>
            <input name="name" type="text" required className="mt-1 w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">อีเมล</label>
            <input name="email" type="email" required className="mt-1 w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">รหัสผ่าน</label>
            <input name="password" type="password" required className="mt-1 w-full border p-2 rounded" />
          </div>

          {state?.message && (
            <p className="text-red-500 text-sm text-center">{state.message}</p>
          )}

          <button 
            disabled={isPending}
            className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 disabled:bg-gray-400"
          >
            {isPending ? 'กำลังสมัคร...' : 'สมัครสมาชิก'}
          </button>
        </form>
        
        <p className="mt-4 text-center text-sm">
          มีบัญชีอยู่แล้ว? <Link href="/login" className="text-orange-600 font-bold">เข้าสู่ระบบ</Link>
        </p>
      </div>
    </div>
  )
}