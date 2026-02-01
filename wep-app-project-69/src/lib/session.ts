// lib/session.ts
import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const secretKey = process.env.SESSION_SECRET || 'secret-key-change-me'
const key = new TextEncoder().encode(secretKey)

// เข้ารหัสข้อมูล Session
export async function encrypt(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d') // ล็อกอินนาน 1 วัน
    .sign(key)
}

// ถอดรหัสเพื่อตรวจสอบว่าล็อกอินหรือยัง
export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    return null
  }
}

// สร้าง Session เมื่อล็อกอินสำเร็จ
export async function createSession(userId: string) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const session = await encrypt({ userId, expires })
  
  // บันทึกลง Cookie
  const cookieStore = await cookies()
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: 'lax',
    path: '/',
  })
}

// ลบ Session เมื่อล็อกเอาท์
export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}