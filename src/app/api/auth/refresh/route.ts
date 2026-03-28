import { NextRequest, NextResponse } from 'next/server';
import { refreshAccessToken } from '../../_lib/token';

function getRefreshToken(request: NextRequest) {
  const cookieToken = request.cookies.get('refreshToken')?.value;
  if (cookieToken) return cookieToken;

  const headerToken = request.headers.get('Authorization');
  if (!headerToken) return null;

  return headerToken.startsWith('Bearer ') ? headerToken.slice(7) : headerToken;
}

function readErrorMessage(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== 'object') return fallback;
  const record = payload as Record<string, unknown>;
  if (typeof record.message === 'string') return record.message;
  if (typeof record.error === 'string') return record.error;
  return fallback;
}

export async function POST(request: NextRequest) {
  try {
    const refreshToken = getRefreshToken(request);
    if (!refreshToken) {
      return NextResponse.json({ error: '리프레시 토큰이 없습니다.' }, { status: 401 });
    }

    const refreshed = await refreshAccessToken(refreshToken);
    if (!refreshed.ok || !refreshed.accessToken) {
      return NextResponse.json(
        { error: readErrorMessage(refreshed.payload, '리프레시 토큰이 유효하지 않거나 만료되었습니다.') },
        { status: refreshed.status || 401 },
      );
    }

    const response = NextResponse.json(refreshed.payload, { status: 200 });
    response.cookies.set('accessToken', refreshed.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('액세스 토큰 재발급 중 오류 발생:', error);
    return NextResponse.json({ error: '서버 내부 오류가 발생했습니다.' }, { status: 500 });
  }
}

