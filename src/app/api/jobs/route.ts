import { NextRequest, NextResponse } from 'next/server';
import ky from 'ky';

const BACKEND_URL = process.env.EXTERNAL_API_BASE_URL || 'http://161.153.21.86:8080';

export async function GET(request: NextRequest) {
  try {
    const response = await ky.get(`${BACKEND_URL}/v1/jobs`, {
      throwHttpErrors: false,
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('직무 목록 조회 중 오류 발생:', error);
    return NextResponse.json({ error: '서버 내부 오류가 발생했습니다.' }, { status: 500 });
  }
}
