 
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const UNAUTH_PAGE = '/login';

const protectedRoutes = ['/', '/config', '/sections/*'];

const protectedApi = [
  {
    method: 'PUT',
    route: '/api/config'
  },
  {
    method: 'POST',
    route: '/api/config'
  },
  {
    method: 'DELETE',
    route: '/api/config'
  },
  {
    method: 'PUT',
    route: '/api/files'
  }
]

/**
 * Handle unauthorized access to pages in protectedRoutes. Redirects to login for now.
 * @param req
 * @param res 
 * @returns 
 */
export const middleware = async (req: NextRequest, res: NextResponse) => {

  const session = await getToken({ req, secret: process.env.JWT_SECRET })

  // validate api
  if (!session && protectedApi.filter((v) => v.method == req.method && req.nextUrl.pathname.startsWith(v.route)).length > 0) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'Unauthorized' }),
       { 
        status: 403, 
        headers: { 'content-type': 'application/json' } 
      }
    )
  }

  // validate page routes
  if (!session && protectedRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL(UNAUTH_PAGE, req.url));
  }

  return NextResponse.next();
}