'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import clsx from 'clsx';
import Typography from '@/components/common/Typography';

type SortOption = {
  label: string;
  value: string;
};

type SortTabProps = {
  options: SortOption[];
  paramKey?: string;
  onTabClick?: (value: string) => void;
  currentValue?: string;
  // 'sort'(기본): 정렬 탭(텍스트 사이 구분선). 'filter': 필터 탭(위아래 선 + 17px + 구분선 없음, QA 3round-4 #16)
  variant?: 'sort' | 'filter';
};

const SortTab = ({ options, paramKey = 'sort', onTabClick, currentValue, variant = 'sort' }: SortTabProps) => {
  const isFilter = variant === 'filter';
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentTab = currentValue || searchParams.get(paramKey) || options[0].value;

  // 🔤 정렬뿐 아니라 다른 곳에서도 쓰일 수 있기에 paramKey도 prop으로 받고,
  // url query parameter로 새로고침시에도 currentTab이 유지될 수 있도록 하였습니다
  // ⚠️ 기획단에서 새로고침시 정렬 초기화 시키는거로 변경시 searchParams 대신 state로 관리예정
  const handleClick = (value: string) => {
    if (onTabClick) {
      onTabClick(value);
      return;
    }
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set(paramKey, value);
    router.push(`?${newParams.toString()}`);
  };

  return (
    <div className={clsx('flex items-center', isFilter && 'border-y border-gray-20 py-4')}>
      {options.map((option, index) => (
        <div key={option.value} role="tablist" className="flex items-center">
          {/* 🏷️ 추후 button 공통 컴포넌트 제작후 교체 예정 */}
          <button
            onClick={() => handleClick(option.value)}
            className={clsx('flex items-center justify-center', isFilter && 'w-[140px]')}
          >
            <Typography
              type={isFilter ? 'Headline2SemiBold' : 'Body3Medium'}
              className={clsx(
                currentTab === option.value ? 'text-gray-90' : isFilter ? 'text-gray-40' : 'text-gray-50',
              )}
            >
              {option.label}
            </Typography>
          </button>
          {!isFilter && index < options.length - 1 && <div className="h-space-12 w-px bg-gray-50 mx-space-8" />}
        </div>
      ))}
    </div>
  );
};

export default SortTab;
