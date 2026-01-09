import { NextResponse } from 'next/server';

export async function PATCH(request: Request, { params }: { params: { archiveId: string } }) {
  const archiveId = params.archiveId;
  // 아카이브 정보 수정
  // 비즈니스 로직 구현 예정
  return NextResponse.json({ message: `PATCH /v1/archive/${archiveId} endpoint` });
}

