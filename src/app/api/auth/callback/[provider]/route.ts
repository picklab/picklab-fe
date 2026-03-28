import { NextResponse, NextRequest } from 'next/server';

const BACKEND_URL = process.env.EXTERNAL_API_BASE_URL || 'http://161.153.21.86:8080';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> | { provider: string } }
) {
  const { provider } = await Promise.resolve(params);
  return NextResponse.json({ message: `GET /v1/auth/callback/${provider} endpoint` });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> | { provider: string } }
) {
  const { provider } = await Promise.resolve(params);

  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Code not provided' }, { status: 400 });
    }

    const backendResponse = await fetch(
      `${BACKEND_URL}/v1/auth/callback/${provider.toUpperCase()}?code=${code}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
    );

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json(
        { error: 'Failed to exchange code with backend', details: errorData },
        { status: backendResponse.status },
      );
    }

    const tokens = await backendResponse.json();
    const { access_token, refresh_token } = tokens.data as {
      access_token: string;
      refresh_token: string;
    };

    const response = NextResponse.json(tokens, { status: 200 });

    response.cookies.set('accessToken', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    response.cookies.set('refreshToken', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error) {
    console.error(`소셜 로그인 콜백(${provider}) 처리 중 오류:`, error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
