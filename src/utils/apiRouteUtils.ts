
import { NextRequest } from 'next/server';

export function getForwardedHeaders(request: NextRequest): HeadersInit {
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });
  return headers;
}
