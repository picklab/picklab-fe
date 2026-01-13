import { NextResponse, NextRequest } from 'next/server';

export async function DELETE(request: NextRequest, { params }: { params: { historyId: string } }) {
  const historyId = params.historyId;
  // 검색 기록 삭제
  // 비즈니스 로직 구현 예정
  return NextResponse.json({ message: `DELETE /v1/search/history/${historyId} endpoint` });
}
