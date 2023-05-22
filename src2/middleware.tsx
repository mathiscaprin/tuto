import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken'
import { secret } from './pages/consts';
 
export function middleware(request: NextRequest) {
    const bearerToken = request.headers.get("authorization")?.split(' ')[1];

    if (!bearerToken) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'authentication failed' }),
        { status: 401, headers: { 'content-type': 'application/json' } },
      );
    }

    try {
      const decoded = jwt.verify(bearerToken, secret);
    }
    catch (error) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'authentication failed' }),
        { status: 401, headers: { 'content-type': 'application/json' } },
      );      
    }

    
}
 
export const config = {
  matcher: '/api/:path*',
};