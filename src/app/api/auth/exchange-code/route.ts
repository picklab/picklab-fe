import { NextRequest, NextResponse } from 'next/server';
import { authCookieMaxAge } from '../../_lib/token';
import { BACKEND_URL } from '@/config/backend';

export async function POST(req: NextRequest) {
  try {
    const { code, provider } = await req.json(); // provider도 함께 받도록 변경

    if (!code || !provider) { // provider도 체크
      return NextResponse.json({ error: 'Code or provider not provided' }, { status: 400 });
    }

    const backendApiUrl = `${BACKEND_URL}/v1/auth/callback/${provider}?code=${code}`;

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
    const maxAge = authCookieMaxAge(refresh_token);

    // 토큰을 HttpOnly 및 Secure 쿠키에 저장합니다.
    response.cookies.set('accessToken', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/', // 모든 경로에서 접근 가능하도록 설정
      maxAge,
    });
    response.cookies.set('refreshToken', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge,
    });

    return response;
  } catch (error) {
    console.error('Error during code exchange:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
