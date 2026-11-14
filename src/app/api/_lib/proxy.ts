import { NextRequest, NextResponse } from 'next/server';
import ky from 'ky';
import { authCookieMaxAge, refreshAccessToken } from './token';
import { BACKEND_URL } from '@/config/backend';

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

// 재발급이 일시 오류로 실패한 경우. 토큰이 무효라고 단정할 수 없어 쿠키를 지우지 않고 다시 시도하게 한다.
function refreshUnavailableResponse() {
  return NextResponse.json({ error: '잠시 후 다시 시도해주세요.' }, { status: 503 });
}

function unauthorizedResponse() {
  return NextResponse.json({ error: '인증 토큰이 없습니다.' }, { status: 401 });
}

function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string | null | undefined,
  currentRefreshToken: string,
) {
  const maxAge = authCookieMaxAge(refreshToken ?? currentRefreshToken);
  response.cookies.set('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
  });

  if (refreshToken) {
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge,
    });
  }
}

// 토큰이 무효(재발급 실패)면 쿠키를 지워 헤더가 로그인 상태로 남지 않게 함
function clearAuthCookies(response: NextResponse) {
  response.cookies.set('accessToken', '', { path: '/', maxAge: 0 });
  response.cookies.set('refreshToken', '', { path: '/', maxAge: 0 });
  return response;
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

    let refreshTried = false;
    // 백엔드가 refreshToken을 거절(401/403)했을 때만 무효로 확정한다. 5xx·429 같은 일시 오류로는 로그아웃시키지 않는다.
    let refreshRejected = false;

    const refreshAndRetry = async () => {
      if (!refreshToken) return null;

      refreshTried = true;
      const refreshed = await refreshAccessToken(refreshToken);
      if (!refreshed.ok || !refreshed.accessToken) {
        refreshRejected = refreshed.status === 401 || refreshed.status === 403;
        return null;
      }

      const retried = await ky(`${BACKEND_URL}${endpoint}`, buildRequestOptions(refreshed.accessToken));
      const retryResponse = await buildResponse(retried);
      setAuthCookies(retryResponse, refreshed.accessToken, refreshed.refreshToken, refreshToken);
      return retryResponse;
    };

    // 무효로 확정된 토큰이면 비로그인 허용 API도 응답과 함께 쿠키를 지워 헤더가 로그인 상태로 남지 않게 한다.
    let tokensInvalid = false;

    if (!accessToken && refreshToken) {
      const retryResponse = await refreshAndRetry();
      if (retryResponse) return retryResponse;
      if (!optionalAuth) return refreshRejected ? clearAuthCookies(unauthorizedResponse()) : refreshUnavailableResponse();
      tokensInvalid = refreshRejected;
    }

    let response = await ky(`${BACKEND_URL}${endpoint}`, buildRequestOptions(accessToken));

    if (response.status === 401 && refreshToken && !refreshTried) {
      const retryResponse = await refreshAndRetry();
      if (retryResponse) return retryResponse;
    }

    if (response.status === 401 && accessToken) {
      if (!optionalAuth) {
        if (refreshToken && !refreshRejected) return refreshUnavailableResponse();
        return clearAuthCookies(await buildResponse(response));
      }
      // 비로그인 허용 API는 무효 토큰 때문에 공개 데이터까지 401이 되지 않도록 토큰 없이 다시 받는다
      response = await ky(`${BACKEND_URL}${endpoint}`, buildRequestOptions());
      tokensInvalid = !refreshToken || refreshRejected;
    }

    const proxied = await buildResponse(response);
    return tokensInvalid ? clearAuthCookies(proxied) : proxied;
  } catch (error) {
    console.error(`${errorContext}:`, error);
    return NextResponse.json({ error: '서버 내부 오류가 발생했습니다.' }, { status: 500 });
  }
}
