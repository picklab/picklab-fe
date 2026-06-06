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
}

export default function RecentSearchHistory({ onSelect }: RecentSearchHistoryProps) {
  const { items, refetch } = useSearchHistory();
  const [pending, setPending] = useState(false);

  // 최근 검색기록이 없으면 섹션을 렌더하지 않는다(빈 상태 숨김)
  if (items.length === 0) return null;

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
      refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="w-[308px]">
      <div className="flex items-center justify-between">
        <span className="text-[16px] font-bold text-gray-90">최근 검색기록</span>
        <button
          type="button"
          onClick={handleDeleteAll}
          disabled={pending}
          className="text-[13px] text-gray-50 disabled:opacity-50"
        >
          전체삭제
        </button>
      </div>
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
    </div>
  );
}
