import { NextRequest, NextResponse } from 'next/server';


const BACKEND_URL = process.env.EXTERNAL_API_BASE_URL || 'http://161.153.21.86:8080';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });

    const url = new URL(`${BACKEND_URL}/v1/activities`);
    searchParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });
    
    
    const response = await fetch(url.toString());
    

    const data = await response.json();


    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('활동 목록 조회 중 오류 발생:', error);
    return NextResponse.json({ error: '서버 내부 오류가 발생했습니다.' }, { status: 500 });
  }
}
