import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;

  const protectedPaths = ['/profile'];
  // 리뷰 작성(/activity/[id]/review)도 비로그인 진입 시 로그인 페이지로 (PIC-144)
  const isReviewWrite = /^\/activity\/[^/]+\/review(\/|$)/.test(pathname);
  const isProtected = isReviewWrite || protectedPaths.some(path => pathname.startsWith(path));

  if (isProtected && !accessToken) {
    const signinUrl = new URL('/signin', request.url);
    signinUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signinUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/activity/:id/review/:path*'],
};
