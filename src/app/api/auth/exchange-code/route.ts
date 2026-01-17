import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { code, provider } = await req.json(); // provider도 함께 받도록 변경

    if (!code || !provider) { // provider도 체크
      return NextResponse.json({ error: 'Code or provider not provided' }, { status: 400 });
    }

    // 백엔드 API 엔드포인트
    const backendApiUrl = `http://161.153.21.86:8080/v1/auth/callback/${provider}?code=${code}`;

    const backendResponse = await fetch(backendApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      console.error('Failed to exchange code with backend:', errorData);
      return NextResponse.json({ error: 'Failed to exchange code with backend', details: errorData }, { status: backendResponse.status });
    }

    const tokens = await backendResponse.json();
    
    const { access_token, refresh_token } = tokens.data as { access_token: string; refresh_token: string };

    const response = NextResponse.json(tokens, { status: 200 });

    // 토큰을 HttpOnly 및 Secure 쿠키에 저장합니다.
    response.cookies.set('accessToken', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/', // 모든 경로에서 접근 가능하도록 설정
      maxAge: 60 * 60 * 24 * 7 // 7일 유효 기간 (예시)
    });
    response.cookies.set('refreshToken', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30 // 30일 유효 기간 (예시)
    });

    return response;
  } catch (error) {
    console.error('Error during code exchange:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
