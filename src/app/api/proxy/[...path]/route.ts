import { NextRequest, NextResponse } from 'next/server';
import ky from 'ky'; // 서버 측에서 ky 사용

const EXTERNAL_API_BASE_URL = process.env.API_BASE_URL

async function handleRequest(req: NextRequest) {
  try {
    const accessToken = req.cookies.get('accessToken')?.value;
    const path = req.nextUrl.pathname.replace('/api/proxy', ''); // '/api/proxy' 부분을 제거하여 실제 외부 API 경로를 얻습니다.
    const externalApiUrl = `${EXTERNAL_API_BASE_URL}${path}${req.nextUrl.search}`;

    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized: No access token found' }, { status: 401 });
    }

    const headers: HeadersInit = {
      'Authorization': `Bearer ${accessToken}`,
    };

    // 클라이언트에서 넘어온 Content-Type 헤더를 유지합니다.
    if (req.headers.get('Content-Type')) {
      headers['Content-Type'] = req.headers.get('Content-Type') as string;
    }

    const kyOptions: Parameters<typeof ky>[1] = {
      method: req.method,
      headers: headers,
      timeout: 30000,
      throwHttpErrors: false, // ky가 4xx, 5xx 에러를 던지지 않도록 설정 (직접 처리)
    };

    // GET, HEAD 요청이 아닌 경우에만 body를 포함합니다.
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      try {
        const reqBody = await req.text(); // text()로 받아서 raw body를 유지
        if (reqBody) {
          kyOptions.body = reqBody;
        }
      } catch (e) {
       console.error('Proxy request failed:', e);
      }
    }

    const externalResponse = await ky(externalApiUrl, kyOptions);

    const responseHeaders = new Headers();
    externalResponse.headers.forEach((value, key) => {
      // 보안상 문제가 될 수 있는 헤더 (예: Set-Cookie)는 제외합니다.
      if (!['set-cookie'].includes(key.toLowerCase())) {
        responseHeaders.set(key, value);
      }
    });

    return new NextResponse(externalResponse.body, {
      status: externalResponse.status,
      statusText: externalResponse.statusText,
      headers: responseHeaders,
    });

  } catch (error) {
    console.error('Proxy request failed:', error);
    return NextResponse.json({ error: 'Proxy internal server error' }, { status: 500 });
  }
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const DELETE = handleRequest;
export const PATCH = handleRequest;
export const HEAD = handleRequest;
export const OPTIONS = handleRequest;
