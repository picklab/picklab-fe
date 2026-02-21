import { NextRequest, NextResponse } from 'next/server';
import ky from 'ky';

const BACKEND_URL = process.env.EXTERNAL_API_BASE_URL || 'http://161.153.21.86:8080';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const accessToken = request.cookies.get('accessToken')?.value;
    if (!accessToken) {
      return NextResponse.json({ error: '인증 토큰이 없습니다.' }, { status: 401 });
    }

    const body = await request.json();

    const response = await ky.patch(`${BACKEND_URL}/v1/archive/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      json: body,
      throwHttpErrors: false,
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(`아카이브 수정(${id}) 중 오류 발생:`, error);
    return NextResponse.json({ error: '서버 내부 오류가 발생했습니다.' }, { status: 500 });
  }
}
