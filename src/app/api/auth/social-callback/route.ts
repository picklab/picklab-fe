import { NextResponse, NextRequest } from 'next/server';
import { serialize } from 'cookie';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');

  if (!code) {
    return NextResponse.json({ message: 'Authorization code not provided' }, { status: 400 });
  }

  // 환경 변수에서 Spring Boot 백엔드의 토큰 교환 엔드포인트 URL을 가져옵니다.
  // 실제 배포 시에는 이 URL을 올바르게 설정해야 합니다.
  const springBootTokenExchangeUrl = process.env.SPRING_BOOT_TOKEN_EXCHANGE_URL;

  if (!springBootTokenExchangeUrl) {
    console.error('SPRING_BOOT_TOKEN_EXCHANGE_URL is not defined in environment variables.');
    return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
  }

  try {
    // Spring Boot 백엔드에 일회성 코드를 보내 토큰 교환 요청
    const backendResponse = await fetch(springBootTokenExchangeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      console.error('Failed to exchange code with Spring Boot:', errorData);
      return NextResponse.json({ message: `Token exchange failed: ${errorData.message || backendResponse.statusText}` }, { status: backendResponse.status });
    }

    const { accessToken, refreshToken } = await backendResponse.json();

    if (!accessToken || !refreshToken) {
      return NextResponse.json({ message: 'Tokens not received from backend' }, { status: 500 });
    }

    // Refresh Token을 HttpOnly 쿠키에 저장
    const serializedRefreshToken = serialize('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // production 환경에서는 HTTPS를 통해서만 쿠키 전송
      sameSite: 'lax', // Next.js 도메인에 대한 쿠키이므로 'lax'가 적절
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1주일 (예시)
    });

    // Access Token은 클라이언트에서 직접 사용할 수 있도록 응답 본문에 포함하거나,
    // 필요에 따라 다른 방식으로 관리할 수 있습니다.
    // 여기서는 간단히 리다이렉트만 수행합니다.

    const response = NextResponse.redirect(new URL('/', request.url)); // 로그인 성공 후 메인 페이지로 리다이렉트
    response.headers.set('Set-Cookie', serializedRefreshToken);

    return response;

  } catch (error) {
    console.error('Error during token exchange process:', error);
    return NextResponse.json({ message: (error as Error).message || 'Internal server error during token exchange' }, { status: 500 });
  }
}
