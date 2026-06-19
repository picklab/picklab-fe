'use client';

import { useState } from 'react';
import Icon from '@/components/common/Icon/Icon';
import {
  deleteAllSearchHistory,
  deleteSearchHistory,
  useSearchHistory,
} from '@/hooks/useSearchHistory';

interface RecentSearchHistoryProps {
  /** 칩 텍스트 클릭 시 해당 검색어로 검색 이동 */
  onSelect: (keyword: string) => void;
  /** true면 기록이 없어도 헤더는 항상 노출(칩만 숨김) */
  alwaysShowHeader?: boolean;
  /** 루트 컨테이너 클래스(폭 등). 기본 w-[308px] */
  className?: string;
}

export default function RecentSearchHistory({
  onSelect,
  alwaysShowHeader = false,
  className,
}: RecentSearchHistoryProps) {
  const { items, refetch } = useSearchHistory();
  const [pending, setPending] = useState(false);

  // 기록이 없을 때: alwaysShowHeader면 헤더만 노출, 아니면 섹션 통째 숨김
  if (items.length === 0 && !alwaysShowHeader) return null;

  const handleDelete = async (id: number) => {
    if (pending) return;
    setPending(true);
    try {
      await deleteSearchHistory(id);
      refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setPending(false);
    }
  };

  const handleDeleteAll = async () => {
    if (pending) return;
    setPending(true);
    try {
      await deleteAllSearchHistory();
    } catch {
      // 전체삭제 엔드포인트 미지원/실패 시 개별 삭제로 폴백
      await Promise.all(items.map((item) => deleteSearchHistory(item.id).catch(() => {})));
    } finally {
      refetch();
      setPending(false);
    }
  };

  return (
    <div className={className ?? 'w-[308px]'}>
      <div className="flex items-center justify-between">
        <span className="text-[16px] font-semibold text-gray-90">최근 검색기록</span>
        <button
          type="button"
          onClick={handleDeleteAll}
          disabled={pending}
          className="text-[11px] text-gray-50 disabled:opacity-50"
        >
          전체삭제
        </button>
      </div>
      {items.length > 0 && (
      <ul className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item.id}>
            <div className="flex items-center gap-1 rounded-full bg-gray-10 py-1 pl-3 pr-2">
              <button
                type="button"
                onClick={() => onSelect(item.keyword)}
                className="max-w-[200px] truncate text-[14px] text-gray-70"
              >
                {item.keyword}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                disabled={pending}
                aria-label={`${item.keyword} 검색기록 삭제`}
                className="text-gray-50 disabled:opacity-50"
              >
                <Icon icon="xMark" size={14} />
              </button>
            </div>
          </li>
        ))}
      </ul>
      )}
    </div>
  );
}
