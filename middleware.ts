 
import { protectedRoutes } from "@/router/routes";
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const UNAUTH_PAGE = '/login';

/**
 * Handle unauthorized access to pages in protectedRoutes. Redirects to login for now.
 * @param req
 * @param res 
 * @returns 
 */
export const middleware = async (req: NextRequest, res: NextResponse) => {

  const session = await getToken({ req, secret: process.env.JWT_SECRET })

  if (!session && protectedRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL(UNAUTH_PAGE, req.url));
  }

  return NextResponse.next();
}