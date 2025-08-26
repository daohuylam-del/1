import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt, Role } from './lib/auth';

const roleMap: { prefix: string; role: Role }[] = [
  { prefix: '/api/admin', role: 'ADMIN' },
  { prefix: '/api/accountant', role: 'ACCOUNTANT' },
  { prefix: '/api', role: 'VIEWER' },
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  const token = req.cookies.get('token')?.value;
  if (!token) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const payload = verifyJwt(token);
  if (!payload) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  for (const { prefix, role } of roleMap) {
    if (pathname.startsWith(prefix) && !hasRole(payload.role, role)) {
      return new NextResponse('Forbidden', { status: 403 });
    }
  }

  return NextResponse.next();
}

function hasRole(userRole: Role, required: Role) {
  const hierarchy: Role[] = ['VIEWER', 'ACCOUNTANT', 'ADMIN'];
  return hierarchy.indexOf(userRole) >= hierarchy.indexOf(required);
}

export const config = {
  matcher: ['/api/:path*'],
};
