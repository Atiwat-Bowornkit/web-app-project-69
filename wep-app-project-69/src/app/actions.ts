// src/app/actions.ts
'use server'

import { deleteSession } from '@/lib/session'
import { redirect } from 'next/navigation'

export async function logout() {
  await deleteSession() // ลบ Cookie
  redirect('/login')    // ดีดกลับไปหน้า Login
}