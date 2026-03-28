import { NextRequest } from 'next/server';
import { proxyWithAuth } from '../../../../_lib/proxy';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  const { id } = await Promise.resolve(params);
  return proxyWithAuth({
    request,
    endpoint: `/v1/activities/${id}/reviews/statistics/job-relevance`,
    method: 'GET',
    optionalAuth: true,
    errorContext: `직무 연관성 평균 점수 조회(${id}) 중 오류 발생`,
  });
}
