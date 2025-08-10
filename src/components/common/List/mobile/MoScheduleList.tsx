
import Button from '@/components/common/Button/Button';
import Chip from '@/components/common/Calendar/Chip';
import CardChip from '@/components/common/Card/CardChip';
import CardDayBadge from '@/components/common/Card/CardDayBadge';
import Icon from '@/components/common/Icon/Icon';
import Typography from '@/components/common/Typography';
import React from 'react';

// 스케줄 아이템 타입 정의
interface ScheduleItem {
  id: string;
  title: string;
  companyName: string;
  category: '대외활동' | '교육' | '공모전/해커톤' | '강연/세미나';
  startDate: string;
  endDate: string;
  isBookmarked: boolean;
  daysLeft: number;
  period: 'start' | 'deadline';
}

// 컴포넌트 props 인터페이스
interface MoScheduleListProps {
  schedule: ScheduleItem;
  onApply?: (id: string) => void;
  onBookmarkToggle?: (id: string) => void;
  className?: string;
}

const MoScheduleList: React.FC<MoScheduleListProps> = ({
  schedule,
  onApply,
  onBookmarkToggle,
  className = '',
}) => {
  // 지원 버튼 클릭 핸들러
  const handleApplyClick = () => {
    onApply?.(schedule.id);
  };

  // 북마크 토글 핸들러
  const handleBookmarkToggle = () => {
    onBookmarkToggle?.(schedule.id);
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).replace(/\./g, '.');
  };

  return (
    <div className={`flex flex-col w-[375px] h-[164px] rounded-[10px] p-5 pt-[18px] border gap-3 ${className}`}>
      <div className="flex justify-between h-6 flex-1">
        <div className="flex gap-2.5">
                  <Chip text={schedule.period === 'start' ? '시작' : '마감'} period={schedule.period} />
                  {/* 추후 수정가능 */}
          <CardDayBadge text={`D-${schedule.daysLeft.toString().padStart(2, '0')}`} variant="default" />
          <CardChip text={schedule.category} />
        </div>
        <div className="flex items-center justify-center">
          <Icon 
            icon={schedule.isBookmarked ? "bookmarkFill" : "bookmarkLine"} 
            size={24} 
            className={`cursor-pointer ${schedule.isBookmarked ? 'text-primary-50' : 'text-gray-30'}`}
            onClick={handleBookmarkToggle}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2 py-[3px] flex-2">
        <Typography type="Body2Semibold">{schedule.title}</Typography>
        <Typography type="Caption2Medium" className="text-gray-50">
          {schedule.companyName}
        </Typography>
      </div>
      <div className="flex justify-between gap-2">
        <div className="flex flex-col gap-2 flex-1">
          <Typography type="Caption2Regular" className="text-gray-50">
            지원기간
          </Typography>
          <Typography type="Caption2Medium" className="text-gray-50">
            {formatDate(schedule.startDate)} ~ {formatDate(schedule.endDate)}
          </Typography>
        </div>
        <Button
          size="sm"
          label="지원"
          buttonStyle="filled"
          icon={{ icon: 'check', position: 'left' }}
          isFullRounded
          onClick={handleApplyClick}
        />
      </div>
    </div>
  );
};

export default MoScheduleList;