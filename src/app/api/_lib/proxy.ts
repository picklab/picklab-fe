import { NextRequest, NextResponse } from 'next/server';
import ky from 'ky';
import { refreshAccessToken } from './token';

const BACKEND_URL = process.env.EXTERNAL_API_BASE_URL || 'http://161.153.21.86:8080';

type ProxyMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type ProxyOptions = {
  request: NextRequest;
  endpoint: string;
  method: ProxyMethod;
  includeJsonBody?: boolean;
  passSearchParams?: boolean;
  optionalAuth?: boolean;
  errorContext: string;
};

function unauthorizedResponse() {
  return NextResponse.json({ error: '인증 토큰이 없습니다.' }, { status: 401 });
}

function setAuthCookies(response: NextResponse, accessToken: string, refreshToken?: string | null) {
  response.cookies.set('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  if (refreshToken) {
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
  }
}

async function buildResponse(response: Response) {
  const status = response.status;
  const contentType = response.headers.get('content-type');
  const rawBody = await response.text();

  if (!rawBody) {
    return new NextResponse(null, { status });
  }

  if (contentType?.includes('application/json')) {
    try {
      const data = JSON.parse(rawBody);
      return NextResponse.json(data, { status });
    } catch {
      return new NextResponse(rawBody, {
        status,
        headers: contentType ? { 'Content-Type': contentType } : undefined,
      });
    }
  }

  return new NextResponse(rawBody, {
    status,
    headers: contentType ? { 'Content-Type': contentType } : undefined,
  });
}

export async function proxyWithAuth({
  request,
  endpoint,
  method,
  includeJsonBody = false,
  passSearchParams = false,
  optionalAuth = false,
  errorContext,
}: ProxyOptions) {
  try {
    const accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;
    if (!accessToken && !refreshToken && !optionalAuth) {
      return unauthorizedResponse();
    }
    const requestBody = includeJsonBody ? await request.json() : undefined;

    const buildRequestOptions = (token?: string): Parameters<typeof ky>[1] => {
      const headers: Record<string, string> = {};

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      if (includeJsonBody) {
        headers['Content-Type'] = 'application/json';
      }

      return {
        method,
        headers,
        throwHttpErrors: false,
        json: requestBody,
        searchParams: passSearchParams ? request.nextUrl.searchParams : undefined,
      };
    };

    const refreshAndRetry = async () => {
      if (!refreshToken) return null;

      const refreshed = await refreshAccessToken(refreshToken);
      if (!refreshed.ok || !refreshed.accessToken) return null;

      const retried = await ky(`${BACKEND_URL}${endpoint}`, buildRequestOptions(refreshed.accessToken));
      const retryResponse = await buildResponse(retried);
      setAuthCookies(retryResponse, refreshed.accessToken, refreshed.refreshToken);
      return retryResponse;
    };

    if (!accessToken && refreshToken) {
      const retryResponse = await refreshAndRetry();
      if (retryResponse) return retryResponse;
      if (!optionalAuth) return unauthorizedResponse();
    }

    let response = await ky(`${BACKEND_URL}${endpoint}`, buildRequestOptions(accessToken));

    if (response.status === 401 && refreshToken) {
      const retryResponse = await refreshAndRetry();
      if (retryResponse) return retryResponse;
    }

    return buildResponse(response);
  } catch (error) {
    console.error(`${errorContext}:`, error);
    return NextResponse.json({ error: '서버 내부 오류가 발생했습니다.' }, { status: 500 });
  }
}
