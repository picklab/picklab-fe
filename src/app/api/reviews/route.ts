import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // 내가 작성한 리뷰 리스트 조회
  // 비즈니스 로직 구현 예정
  return NextResponse.json({ message: 'GET /v1/reviews (My Reviews List) endpoint' });
}

export async function POST(request: Request) {
  // 리뷰 등록 (/v1/review 와 겹치지만 OpenAPI 문서 상 /v1/reviews POST가 없으므로 이 엔드포인트를 사용하지 않습니다.)
  return NextResponse.json({ message: 'POST /v1/reviews (Review Create) endpoint - Not used as per OpenAPI doc' });
}

