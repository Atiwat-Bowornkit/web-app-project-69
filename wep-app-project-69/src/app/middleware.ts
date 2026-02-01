// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/session'
import { cookies } from 'next/headers'

// 1. ระบุหน้าที่ต้องถูกล็อค (Protected Routes)
const protectedRoutes = ['/dashboard', '/inventory', '/planner', '/profile']
// 2. ระบุหน้าสาธารณะ (Public Routes)
const publicRoutes = ['/login', '/register', '/']

export default async function middleware(req: NextRequest) {
  // 3. ตรวจสอบว่า user อยู่ในหน้าที่ต้องล็อคหรือไม่
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
  const isPublicRoute = publicRoutes.includes(path)

  // 4. ดึงข้อมูล Session จาก Cookie
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  // 5. ถ้าอยู่ในหน้าที่ต้องล็อค แต่ไม่มี Session -> ดีดกลับไปหน้า Login
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // 6. (Option) ถ้า Login แล้ว แต่อยากเข้าหน้า Login อีก -> ดีดไป Dashboard เลย
  if (isPublicRoute && session?.userId && !req.nextUrl.pathname.startsWith('/dashboard') && path !== '/') {
     return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }

  return NextResponse.next()
}

// Config เพื่อบอกว่า Middleware นี้จะทำงานกับ Route ไหนบ้าง
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}

const protectedRoutes = ['/dashboard', '/recipes', '/inventory', '/planner', '/profile']

