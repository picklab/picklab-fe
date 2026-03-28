import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.EXTERNAL_API_BASE_URL || 'http://161.153.21.86:8080';

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: '인증 토큰이 없습니다.' }, { status: 401 });
  }

  try {
    const backendResponse = await fetch(`${BACKEND_URL}/notifications/subscribe`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'text/event-stream',
      },
    });

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: 'SSE 연결에 실패했습니다.' },
        { status: backendResponse.status },
      );
    }

    return new Response(backendResponse.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('SSE 알림 구독 중 오류 발생:', error);
    return NextResponse.json({ error: '서버 내부 오류가 발생했습니다.' }, { status: 500 });
  }
}
