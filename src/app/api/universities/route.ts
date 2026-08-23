import { NextRequest } from 'next/server';
import { proxyWithAuth } from '../_lib/proxy';

// 대학교 검색 (회원가입 학교명 자동완성, PIC-82). 로그인 전에도 호출되므로 인증 선택.
export async function GET(request: NextRequest) {
  return proxyWithAuth({
    request,
    endpoint: '/v1/universities',
    method: 'GET',
    passSearchParams: true,
    optionalAuth: true,
    errorContext: '대학교 검색 중 오류 발생',
  });
}
