'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import Icon from '@/components/common/Icon/Icon';
import Typography from '@/components/common/Typography';
import useArchiveActivities from '@/hooks/useArchiveActivities';

interface ReviewWriteModalProps {
  onClose: () => void;
}

/**
 * GNB 리뷰(연필) 진입 → "어떤 활동에 참여하셨나요?" 검색 모달.
 * 활동 선택 후 "작성하기" → /activity/{activityId}/review (기존 작성 페이지 재사용).
 * 데이터 소스: GET /api/archive (참여 활동). 검색은 클라이언트 제목 필터.
 * (활동 목록 검색 API/수료여부 필드는 백엔드 확인 필요 — ActivityChangeModal과 동일 이슈)
 */
export default function ReviewWriteModal({ onClose }: ReviewWriteModalProps) {
  const router = useRouter();
  const { data, loading } = useArchiveActivities();
  const [keyword, setKeyword] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const kw = keyword.trim();
    if (!kw) return data;
    return data.filter((item) => item.title.includes(kw));
  }, [data, keyword]);

  const selected = data.find((item) => item.id === selectedId) ?? null;

  const handleWrite = () => {
    if (!selected) return;
    router.push(`/activity/${selected.activityId}/review`);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-dimmed-30 px-4"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-[760px] rounded-2xl bg-gray-0 p-6 pc:p-8">
        <div className="flex items-center justify-between">
          <Typography type="Heading1Bold" className="text-gray-90">
            어떤 활동에 참여하셨나요?
          </Typography>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="flex size-6 items-center justify-center"
          >
            <Icon icon="xMark" size={24} className="text-gray-90" />
          </button>
        </div>

        {/* 검색창 */}
        <div className="mt-5 flex h-[52px] items-center gap-2 rounded-lg border border-gray-30 px-4">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="활동명을 검색해 보세요!"
            className="flex-1 bg-transparent text-[15px] text-gray-90 outline-none placeholder:text-gray-40"
          />
          <Icon icon="search" size={24} className="text-gray-90" />
        </div>

        {/* 상태 메시지 (로딩/빈 목록) — PC/모바일 공통 */}
        {loading || filtered.length === 0 ? (
          <div className="mt-4 flex h-[180px] items-center justify-center">
            <Typography type="Body3Regular" className="text-gray-40">
              {loading ? '불러오는 중이에요...' : '참여한 활동이 없어요'}
            </Typography>
          </div>
        ) : (
          <>
            {/* PC: 테이블 형태 */}
            <div className="mt-4 hidden pc:block">
              <div className="grid grid-cols-[2fr_1.4fr_1fr_1fr] border-b border-gray-20 px-4 py-3">
                {['활동명', '주체기관/단체명', '활동구분', '수료여부'].map((h, i) => (
                  <Typography
                    key={h}
                    type="Body3Medium"
                    className={clsx('text-gray-50', i === 0 ? 'text-left' : 'text-center')}
                  >
                    {h}
                  </Typography>
                ))}
              </div>

              {/* 기본 5개 표출, 5개 이상이면 스크롤 (행 약 64px × 5) */}
              <div className="max-h-[320px] overflow-y-auto">
                {filtered.map((item) => {
                  const active = selectedId === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedId(item.id)}
                      aria-pressed={active}
                      className={clsx(
                        'grid w-full grid-cols-[2fr_1.4fr_1fr_1fr] items-center border-b border-gray-10 px-4 py-4 text-left transition-colors last:border-b-0',
                        active ? 'bg-primary-5' : 'hover:bg-gray-5',
                      )}
                    >
                      <Typography
                        type="Body3Medium"
                        className={clsx('break-keep pr-2', active ? 'text-primary-60' : 'text-gray-90')}
                      >
                        {item.title}
                      </Typography>
                      <Typography type="Body3Regular" className="truncate px-2 text-center text-gray-50">
                        {item.organization || '-'}
                      </Typography>
                      <div className="flex justify-center">
                        <span className="rounded-full bg-gray-10 px-space-8 py-1">
                          <Typography type="Caption2Medium" className="text-gray-60">
                            {item.chipTitle}
                          </Typography>
                        </span>
                      </div>
                      {/* 수료여부: 백엔드가 수료여부(수료완료/중도하차) 필드를 내려주기 전까지 비워둠 */}
                      <div aria-hidden />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 모바일: 카드형 리스트 */}
            <div className="mt-4 flex max-h-[360px] flex-col gap-3 overflow-y-auto pc:hidden">
              {filtered.map((item) => {
                const active = selectedId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    aria-pressed={active}
                    className={clsx(
                      'flex w-full items-start justify-between gap-3 rounded-lg border p-4 text-left transition-colors',
                      active ? 'border-primary-50 bg-primary-5' : 'border-gray-20 hover:bg-gray-5',
                    )}
                  >
                    <div className="flex min-w-0 flex-col gap-1">
                      <Typography
                        type="Body3Medium"
                        className={clsx('line-clamp-2 break-keep', active ? 'text-primary-60' : 'text-gray-90')}
                      >
                        {item.title}
                      </Typography>
                      <Typography type="Caption2Regular" className="truncate text-gray-50">
                        {item.organization || '-'}
                      </Typography>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span className="rounded-full bg-gray-10 px-space-8 py-1">
                        <Typography type="Caption2Medium" className="text-gray-60">
                          {item.chipTitle}
                        </Typography>
                      </span>
                      {/* 수료여부: 백엔드가 수료여부 필드를 내려주기 전까지 비워둠 */}
                      <div aria-hidden />
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* 버튼 — 모바일: [작성하기] 하나 전체폭 / PC: [나가기][작성하기] */}
        <div className="mt-8 flex justify-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="hidden h-space-48 w-[160px] rounded-small bg-gray-5 hover:bg-gray-10 pc:block"
          >
            <Typography type="Body2Medium" className="text-gray-90">
              나가기
            </Typography>
          </button>
          <button
            type="button"
            onClick={handleWrite}
            disabled={!selected}
            className="h-space-48 w-full rounded-small bg-primary-50 hover:bg-primary-60 disabled:bg-gray-10 pc:w-[160px]"
          >
            <Typography type="Body2Medium" className={selected ? 'text-gray-0' : 'text-gray-60'}>
              작성하기
            </Typography>
          </button>
        </div>
      </div>
    </div>
  );
}
