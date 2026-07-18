'use client';

import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import Icon from '@/components/common/Icon/Icon';
import Typography from '@/components/common/Typography';
import useNotifications, { type NotificationItem, type NotificationType } from '@/hooks/useNotifications';

// 알림 타입 → 카테고리 라벨(초록) / 보조 문구 (백엔드 NotificationResponse에 본문 필드가 없어 타입 기준 문구 사용)
const TYPE_LABEL: Record<NotificationType, string> = {
  POPULAR_ACTIVITY: '직무 맞춤 공고',
  ACTIVITY_CREATED: '새 공고',
  ACTIVITY_DEADLINE_REMINDER: '마감 임박 공고',
};
const TYPE_DESC: Record<NotificationType, string> = {
  POPULAR_ACTIVITY: '지금 가장 주목받는 활동 공고를 놓치지 마세요!',
  ACTIVITY_CREATED: '새로운 활동 공고가 등록되었어요.',
  ACTIVITY_DEADLINE_REMINDER: '관심 공고의 마감이 다가오고 있어요.',
};

// 'YYYY-MM-DD...' → 'YYYY.MM.DD'
const formatDate = (v?: string) => (v ? v.slice(0, 10).replace(/-/g, '.') : '-');

// 백엔드 알림 link는 `/activities/{id}`(복수)로 오는데 앱 상세 라우트는 `/activity/{id}`(단수) → 정규화.
const normalizeLink = (link: string) => link.replace(/^\/activities\//, '/activity/');

function DeleteAllButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 rounded-full border border-gray-30 px-4 py-2 hover:bg-gray-5"
    >
      <Typography type="Body3Medium" className="text-gray-70">
        {label}
      </Typography>
    </button>
  );
}

function NotificationRow({
  item,
  onClick,
  onDismiss,
}: {
  item: NotificationItem;
  onClick: () => void;
  onDismiss: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className="flex items-start justify-between gap-4 border-b border-gray-10 py-5"
    >
      <div className={clsx('flex min-w-0 flex-col gap-1', item.is_read && 'opacity-40')}>
        <Typography type="Caption1Medium" className="text-primary-50">
          {TYPE_LABEL[item.type] ?? '알림'}
        </Typography>
        <Typography type="Body1Semibold" className="truncate text-gray-90">
          {item.title}
        </Typography>
        <Typography type="Body3Regular" className="text-gray-50">
          {TYPE_DESC[item.type] ?? ''}
        </Typography>
        <Typography type="Caption1Regular" className="mt-1 text-gray-40">
          {formatDate(item.created_at)}
        </Typography>
      </div>
      <button
        type="button"
        aria-label="알림 삭제"
        onClick={(e) => {
          e.stopPropagation();
          onDismiss();
        }}
        className="flex size-6 shrink-0 items-center justify-center"
      >
        <Icon icon="xMark" size={20} className="text-gray-90" />
      </button>
    </div>
  );
}

export default function NotificationsPage() {
  const router = useRouter();
  const { data, loading, deleteAll, dismiss, markRead } = useNotifications();

  // 알림 클릭 시 읽음 처리 후 링크 이동
  const handleOpen = (item: NotificationItem) => {
    markRead(item.id);
    if (item.link) router.push(normalizeLink(item.link));
  };

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 pb-20 pt-4 pc:px-5 pc:pt-10">
      {/* 제목 (+ 모바일 전체삭제) */}
      <div className="flex items-center justify-between">
        <Typography type="Title2Bold" className="text-gray-90">
          알림
        </Typography>
        <div className="pc:hidden">
          <DeleteAllButton label="전체삭제" onClick={deleteAll} />
        </div>
      </div>

      {/* 안내 바 (+ PC 전체삭제) */}
      <div className="mt-4 flex items-center justify-between rounded-lg bg-gray-5 px-5 py-4 pc:mt-6">
        <Typography type="Body3Regular" className="text-gray-50">
          최근 30일 동안의 알림만 확인 가능합니다.
        </Typography>
        <div className="hidden pc:block">
          <DeleteAllButton label="알림 전체삭제" onClick={deleteAll} />
        </div>
      </div>

      {/* 목록 */}
      {loading ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <Typography type="Body2Medium" className="text-gray-50">
            불러오는 중...
          </Typography>
        </div>
      ) : data.length === 0 ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <Typography type="Body2Medium" className="text-gray-40">
            새로운 알림이 없어요.
          </Typography>
        </div>
      ) : (
        <div className="mt-2">
          {data.map((item) => (
            <NotificationRow
              key={item.id}
              item={item}
              onClick={() => handleOpen(item)}
              onDismiss={() => dismiss(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
