import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { secret } from './pages/consts';
import { jwtVerify } from "jose"


export async function middleware(request: NextRequest) {
  const bearerToken = request.headers.get("authorization")?.split(' ')[1];
  if (!bearerToken) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'Authentication failed' }),
      { status: 401, headers: { 'content-type': 'application/json' } },
    );
  }

  try {
    const decoded = await jwtVerify(bearerToken, new TextEncoder().encode(secret));
    return NextResponse.next();
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'Invalid JWT' }),
      { status: 401, headers: { 'content-type': 'application/json' } },
    );
  }
}

export const config = {
  matcher: '/api/:path*',
};