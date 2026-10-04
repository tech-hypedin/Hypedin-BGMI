import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify, type JWTPayload } from 'jose';

// ---------------------------------------------------------------------------
// Route protection map — adjust paths to match your actual route structure
// ---------------------------------------------------------------------------
const ROUTE_ROLES: Record<string, string[]> = {
  '/manager': ['Manager'],
  '/admin':      ['Admin'],
  '/dashboard':  ['Ambassador'],
};

const LOGIN_PAGE    = '/login';
const UNAUTH_PAGE   = '/unauthorized';

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Determine which role(s) this path requires (null = no protection needed)
  const requiredRoles = getRequiredRoles(pathname);
  if (!requiredRoles) return NextResponse.next(); // public route — pass through

  // Read the httpOnly JWT cookie — the token name must match what your
  // backend sets (change 'token' below to your actual cookie name)
  const token = req.cookies.get('token')?.value;

  if (!token) {
    // Not logged in at all — send to login
    return redirectTo(req, LOGIN_PAGE);
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret) as { payload: JWTPayload & { role?: string } };

    const userRole = payload.role;

    if (!userRole || !requiredRoles.includes(userRole)) {
      // Logged in but wrong role
      return redirectTo(req, UNAUTH_PAGE);
    }

    // All good — pass through, optionally forward role as a header for layouts
    const response = NextResponse.next();
    response.headers.set('x-user-role', userRole); // optional — useful for server components
    return response;

  } catch {
    // Token invalid, expired, or tampered — clear it and redirect to login
    const response = redirectTo(req, LOGIN_PAGE);
    response.cookies.delete('token'); // clean up the bad cookie
    return response;
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getRequiredRoles(pathname: string): string[] | null {
  for (const [prefix, roles] of Object.entries(ROUTE_ROLES)) {
    if (pathname === prefix || pathname.startsWith(prefix + '/')) {
      return roles;
    }
  }
  return null; // not a protected route
}

function redirectTo(req: NextRequest, destination: string) {
  const url = req.nextUrl.clone();
  url.pathname = destination;
  // Preserve the original URL as a redirect param so login can send them back
  if (destination === LOGIN_PAGE) {
    url.searchParams.set('from', req.nextUrl.pathname);
  }
  return NextResponse.redirect(url);
}

// ---------------------------------------------------------------------------
// Matcher — only run middleware on these paths (assets are excluded automatically)
// ---------------------------------------------------------------------------
export const config = {
  matcher: [
    '/admin/:path*',
    '/manager',
    '/dashboard/:path*',
    // Add any other protected path prefixes here
  ],
};