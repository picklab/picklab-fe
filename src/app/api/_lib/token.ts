import ky from 'ky';
import { BACKEND_URL } from '@/config/backend';

export function extractAccessToken(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') return null;

  const record = payload as Record<string, unknown>;

  const directCandidates = [record.accessToken, record.access_token, record.token];
  for (const candidate of directCandidates) {
    if (typeof candidate === 'string' && candidate.trim()) return candidate;
  }

  const nested = record.data;
  if (nested && typeof nested === 'object') {
    const nestedRecord = nested as Record<string, unknown>;
    const nestedCandidates = [nestedRecord.accessToken, nestedRecord.access_token, nestedRecord.token];
    for (const candidate of nestedCandidates) {
      if (typeof candidate === 'string' && candidate.trim()) return candidate;
    }
  }

  return null;
}

export function extractRefreshToken(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') return null;

  const record = payload as Record<string, unknown>;

  const directCandidates = [record.refreshToken, record.refresh_token];
  for (const candidate of directCandidates) {
    if (typeof candidate === 'string' && candidate.trim()) return candidate;
  }

  const nested = record.data;
  if (nested && typeof nested === 'object') {
    const nestedRecord = nested as Record<string, unknown>;
    const nestedCandidates = [nestedRecord.refreshToken, nestedRecord.refresh_token];
    for (const candidate of nestedCandidates) {
      if (typeof candidate === 'string' && candidate.trim()) return candidate;
    }
  }

  return null;
}

export async function refreshAccessToken(refreshToken: string) {
  const response = await ky.post(`${BACKEND_URL}/v1/auth/refresh`, {
    headers: {
      Authorization: refreshToken,
    },
    throwHttpErrors: false,
  });

  const payload = await response.json().catch(() => ({}));
  const accessToken = response.ok ? extractAccessToken(payload) : null;
  const nextRefreshToken = response.ok ? extractRefreshToken(payload) : null;

  return {
    ok: !!accessToken,
    status: response.status,
    accessToken,
    refreshToken: nextRefreshToken,
    payload,
  };
}

const FALLBACK_AUTH_COOKIE_SECONDS = 60 * 60 * 24 * 7;

/**
 * 로그인 쿠키 수명(초). 쿠키가 refreshToken 만료보다 오래 남으면 만료 뒤에도 헤더가 로그인 상태로 보이므로
 * refreshToken의 exp에 맞춘다. accessToken 쿠키도 같은 수명을 쓴다. accessToken 자체는 짧지만 만료되면
 * 프록시가 재발급하고, 미들웨어는 accessToken 쿠키 유무로 보호 페이지 접근을 판단하기 때문이다.
 * 서명 검증은 백엔드 몫이라 exp만 읽고, 읽지 못하면 기본 7일을 쓴다.
 */
export function authCookieMaxAge(refreshToken?: string | null): number {
  if (!refreshToken) return FALLBACK_AUTH_COOKIE_SECONDS;
  try {
    const payload = refreshToken.split('.')[1];
    const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    if (typeof json.exp !== 'number') return FALLBACK_AUTH_COOKIE_SECONDS;
    return Math.max(0, json.exp - Math.floor(Date.now() / 1000));
  } catch {
    return FALLBACK_AUTH_COOKIE_SECONDS;
  }
}
