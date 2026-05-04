import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // ดึง token จาก HTTP-only cookie
  const token = request.cookies.get('admin_token')?.value;
  
  console.log(`[Middleware] Path: ${request.nextUrl.pathname}, Token: ${token ? 'FOUND' : 'MISSING'}`);

  // ถ้าพยายามเข้าหน้า /admin แต่ไม่ใช่หน้า /admin/login
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    if (!token) {
      console.log(`[Middleware] Redirecting to /admin/login because token is missing`);
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ถ้าเข้าหน้า login แต่มี token อยู่แล้ว ให้ redirect ไปหน้า dashboard
  if (request.nextUrl.pathname.startsWith('/admin/login') && token) {
    console.log(`[Middleware] Redirecting to /admin because token is present`);
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
