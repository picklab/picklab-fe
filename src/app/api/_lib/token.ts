import ky from 'ky';

const BACKEND_URL = process.env.EXTERNAL_API_BASE_URL || 'http://161.153.21.86:8080';

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

export async function refreshAccessToken(refreshToken: string) {
  const response = await ky.post(`${BACKEND_URL}/v1/auth/refresh`, {
    headers: {
      Authorization: refreshToken,
    },
    throwHttpErrors: false,
  });

  const payload = await response.json().catch(() => ({}));
  const accessToken = response.ok ? extractAccessToken(payload) : null;

  return {
    ok: !!accessToken,
    status: response.status,
    accessToken,
    payload,
  };
}

