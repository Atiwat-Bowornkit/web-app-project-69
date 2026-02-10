'use client'

import { loginUser } from './action'
import Link from 'next/link'
import { useActionState } from 'react'

export default function LoginPage() {
  const [state, action, isPending] = useActionState(loginUser, undefined)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">เข้าสู่ระบบ</h2>
        
        <form action={action} className="space-y-4">
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
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isPending ? 'กำลังเข้าสู่ระบบ...' : 'Login'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          ยังไม่มีบัญชี? <Link href="/register" className="text-blue-600 font-bold">สมัครสมาชิก</Link>
        </p>
      </div>
    </div>
  )
}