import React from 'react';
import clsx from 'clsx';
import Typography, { TypographyTypes } from '@/components/common/Typography';

// 🏷️ 해당 컴포넌트에서 job prop으로 받을 수 있는 종류
type JobType = '기획' | '개발' | '마케팅' | '디자인' | 'AI';
type TypographyKeys = keyof typeof TypographyTypes;

interface CardJobChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  job: JobType;
  typoType?: Extract<TypographyKeys, 'Caption2Medium' | 'Caption3Medium'>;
}

const CardJobChip = ({ job, typoType = 'Caption2Medium', className = '', ...props }: CardJobChipProps) => {
  // variant별 클래스 맵
  const jobClasses: Record<JobType, { bg: string; text: string }> = {
    기획: { bg: 'bg-planning-bg', text: 'text-planning-text' },
    개발: { bg: 'bg-development-bg', text: 'text-development-text' },
    마케팅: { bg: 'bg-marketing-bg', text: 'text-marketing-text' },
    디자인: { bg: 'bg-design-bg', text: 'text-design-text' },
    AI: { bg: 'bg-ai-bg', text: 'text-ai-text' },
  };

  const selected = jobClasses[job];

  // 개발모드일때만 5개의 job중에 없는 값 입력시 콘솔에러 출력
  if (!selected && process.env.NODE_ENV === 'development') {
    console.error(`CardJobChip: 알 수 없는 job 값 "${job}"이 전달되었습니다.`);
  }

  return (
    <Typography
      type={typoType} // Typography 타입을 prop으로 받아서 사용
      role="listitem" // 해당 컴포넌트는 리스트 내부에 사용되므로 role 추가
      className={clsx(
        'w-fit rounded px-space-8 h-[22px] flex justify-center items-center cursor-default',
        selected?.bg,
        selected?.text,
        className,
      )}
      aria-label={`직무: ${job}`} // 리스트 내부 하나하나 item의 이름을 스크린리더가 읽을 수 있게 추가
      {...props}
    >
      {job}
    </Typography>
  );
};

export default CardJobChip;
