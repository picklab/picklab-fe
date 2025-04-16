'use client';

import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import ChevronIconButton from './ChevronIconButton';
import PaginationNumberButton from './PaginationNumberButton';

interface PaginationProps {
  totalPage: number; // 전체 페이지 수
  activePage: number; // 현재 활성화된 페이지
}

const Pagination: React.FC<PaginationProps> = ({ totalPage, activePage }) => {
  const router = useRouter();
  const pathname = usePathname();

  // ◀️ "이전 10페이지" 버튼 눌렀을 때 이동할 페이지 (최소 1페이지 보장)
  const prevPage = activePage - 10 > 1 ? activePage - 10 : 1;

  // ▶️ "다음 10페이지" 버튼 눌렀을 때 이동할 페이지 (최대 totalPage 이하 보장)
  const nextPage = activePage + 10 < totalPage ? activePage + 10 : totalPage;

  const maxPageToShow = 10; // 한 번에 보여줄 최대 페이지 수

  // 페이지 시작 번호 계산
  let startPage = getPaginationStart(activePage);
  let endPage = startPage + maxPageToShow - 1;

  // 끝 페이지가 전체 페이지 수를 넘지 않도록 조정
  if (endPage > totalPage) {
    endPage = totalPage;
    startPage = Math.max(1, endPage - maxPageToShow + 1);
  }

  // 페이지 숫자 버튼 생성
  const generatePagination = Array.from({ length: endPage - startPage + 1 }, (_, i) => {
    const pageNumber = startPage + i;

    return (
      <PaginationNumberButton
        key={pageNumber}
        active={pageNumber === activePage} // 현재 페이지일 경우 활성화 스타일
        disabled={pageNumber === activePage} // 현재 페이지는 비활성화
        onClick={() => pushPage(pathname, pageNumber)}
      >
        {pageNumber}
      </PaginationNumberButton>
    );
  });

  //  현재 페이지를 기준으로 시작 페이지 계산
  function getPaginationStart(page: number): number {
    return page - 4 > 1 ? page - 4 : 1;
  }

  //  페이지 이동 함수 - URL의 쿼리 파라미터 변경
  function pushPage(pathname: string, route: string | number) {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('page', String(route));
    router.push(`${pathname}?${searchParams.toString()}`);
  }

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {/* ◀️ 이전 페이지 버튼 */}
      <ChevronIconButton
        direction="left"
        disabled={activePage - 5 < 1} // 처음페이지에 가까울 경우 비활성화
        onClick={() => {
          pushPage(pathname, prevPage);
        }}
      />

      {/* 페이지 숫자 목록 */}
      {generatePagination}

      {/* ▶️ 다음 페이지 버튼 */}
      <ChevronIconButton
        direction="right"
        disabled={activePage + 5 > totalPage} // 마지막에 가까우면 비활성화
        onClick={() => {
          pushPage(pathname, nextPage);
        }}
      />
    </div>
  );
};

export default Pagination;
