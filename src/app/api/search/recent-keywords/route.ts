import { NextRequest, NextResponse } from 'next/server';
import ky from 'ky';

const BACKEND_URL = process.env.EXTERNAL_API_BASE_URL || 'http://161.153.21.86:8080';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accessToken = request.cookies.get('accessToken')?.value;
    if (!accessToken) {
      return NextResponse.json({ error: '인증 토큰이 없습니다.' }, { status: 401 });
    }

    const response = await ky.get(`${BACKEND_URL}/v1/search/history/recent-keywords`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      searchParams,
      throwHttpErrors: false,
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('최근 검색어 조회 중 오류 발생:', error);
    return NextResponse.json({ error: '서버 내부 오류가 발생했습니다.' }, { status: 500 });
  }
}
