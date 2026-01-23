import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const reviewId = params.id;
  // 내가 작성한 리뷰 단건 조회
  // 비즈니스 로직 구현 예정
  return NextResponse.json({ message: `GET /v1/reviews/${reviewId} endpoint` });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const reviewId = params.id;
  // 리뷰 수정
  // 비즈니스 로직 구현 예정
  return NextResponse.json({ message: `PUT /v1/reviews/${reviewId} endpoint` });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const reviewId = params.id;
  // 리뷰 삭제
  // 비즈니스 로직 구현 예정
  return NextResponse.json({ message: `DELETE /v1/reviews/${reviewId} endpoint` });
}
