import React from 'react';
import Typography from '@/components/common/Typography';

// 🏷️ 해당 컴포넌트에서 job prop으로 받을 수 있는 종류
type JobType = '기획' | '개발' | '마케팅' | '디자인' | 'AI';

interface JobChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  job: JobType;
}

const JobChip = ({ job, className = '', ...props }: JobChipProps) => {
  let bg = '' as string;
  let text = '' as string;

  switch (job) {
    case '기획':
      bg = 'bg-planning-bg';
      text = 'text-planning-text';
      break;
    case '개발':
      bg = 'bg-development-bg';
      text = 'text-development-text';
      break;
    case '마케팅':
      bg = 'bg-marketing-bg';
      text = 'text-marketing-text';
      break;
    case '디자인':
      bg = 'bg-design-bg';
      text = 'text-design-text';
      break;
    case 'AI':
      bg = 'bg-ai-bg';
      text = 'text-ai-text';
      break;
    default: {
      // 개발모드일때만 5개의 job중에 없는 값 입력시 콘솔에러 출력
      if (process.env.NODE_ENV === 'development') {
        console.error(`JobChip: 알 수 없는 job 값 "${job}"이 전달되었습니다.`);
      }
    }
  }

  return (
    <Typography
      type="Caption2Medium"
      role="listitem" // 해당 컴포넌트는 리스트 내부에 사용되므로 role 추가
      className={`${bg} ${text} w-fit rounded px-space-6 py-space-base inline-block cursor-default ${className}`}
      aria-label={`직무: ${job}`} // 리스트 내부 하나하나 item의 이름을 스크린리더가 읽을 수 있게 추가
      {...props}
    >
      {job}
    </Typography>
  );
};

export default JobChip;
