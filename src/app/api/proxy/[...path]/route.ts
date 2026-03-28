import { NextRequest, NextResponse } from 'next/server';
import ky from 'ky';
import { refreshAccessToken } from '../../_lib/token';

const EXTERNAL_API_BASE_URL = process.env.EXTERNAL_API_BASE_URL || 'http://161.153.21.86:8080';

function buildProxyResponse(externalResponse: Response) {
  const responseHeaders = new Headers();
  externalResponse.headers.forEach((value, key) => {
    if (key.toLowerCase() !== 'set-cookie') {
      responseHeaders.set(key, value);
    }
  });

  return new NextResponse(externalResponse.body, {
    status: externalResponse.status,
    statusText: externalResponse.statusText,
    headers: responseHeaders,
  });
}

async function handleRequest(req: NextRequest) {
  try {
    const accessToken = req.cookies.get('accessToken')?.value;
    const refreshToken = req.cookies.get('refreshToken')?.value;
    const path = req.nextUrl.pathname.replace('/api/proxy', '');
    const externalApiUrl = `${EXTERNAL_API_BASE_URL}${path}${req.nextUrl.search}`;

    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized: No access token found' }, { status: 401 });
    }

    let reqBody: string | undefined;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      reqBody = await req.text();
    }

    const buildKyOptions = (token: string): Parameters<typeof ky>[1] => {
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
      };

      const contentType = req.headers.get('Content-Type');
      if (contentType) {
        headers['Content-Type'] = contentType;
      }

      const options: Parameters<typeof ky>[1] = {
        method: req.method,
        headers,
        timeout: 30000,
        throwHttpErrors: false,
      };

      if (reqBody) {
        options.body = reqBody;
      }

      return options;
    };

    let externalResponse = await ky(externalApiUrl, buildKyOptions(accessToken));

    if (externalResponse.status === 401 && refreshToken) {
      const refreshed = await refreshAccessToken(refreshToken);

      if (refreshed.ok && refreshed.accessToken) {
        externalResponse = await ky(externalApiUrl, buildKyOptions(refreshed.accessToken));
        const retryResponse = buildProxyResponse(externalResponse);
        retryResponse.cookies.set('accessToken', refreshed.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
        });
        return retryResponse;
      }
    }

    return buildProxyResponse(externalResponse);
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
