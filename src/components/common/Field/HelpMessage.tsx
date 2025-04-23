import Icon from '@/components/common/Icon/Icon';
import Typography, { TypographyProps } from '@/components/common/Typography';
import clsx from 'clsx';
import React from 'react';

// props 정의: Typography에서 type과 children은 제외하고,
// title(텍스트)과 상태(status)를 추가로 받음
interface HelpMessageProps extends Omit<TypographyProps, 'type' | 'children'> {
  title: string;
  status?: 'default' | 'error' | 'success';
}

// 상태별 텍스트 색상 클래스 정의
const statusClasses = {
  default: 'text-gray-50',
  error: 'text-danger-50',
  success: 'text-success-50',
};

const HelpMessage = ({ title, status = 'default', ...props }: HelpMessageProps) => {
  return (
    <Typography
      // 기본적으로 Body3Medium 텍스트 스타일 사용
      type="Body3Medium"
      // 에러 상태일 경우, 스크린 리더가 즉시 읽도록 role과 aria-live 추가
      role={status === 'error' ? 'alert' : undefined}
      aria-live={status === 'error' ? 'assertive' : status === 'success' ? 'polite' : undefined}
      // 상태에 따라 텍스트 색상과 레이아웃 클래스 적용
      className={clsx('flex h-space-24 w-fit gap-1 items-center', statusClasses[status])}
      {...props}
    >
      {/* 에러 상태일 때 아이콘 렌더링, 시각적 표시만 하고 스크린리더는 무시 */}
      {status === 'error' && (
        <Icon icon="alertCircle" width={20} className={statusClasses[status]} aria-hidden="true" />
      )}

      {/* 성공 상태일 때 아이콘 렌더링, 역시 시각적 표시만 하고 스크린리더는 무시 */}
      {status === 'success' && (
        <div className="size-space-20 p-1">
          <Icon aria-hidden="true" icon="check" className={statusClasses[status]} />
        </div>
      )}

      {/* 텍스트 메시지 출력 */}
      {title}
    </Typography>
  );
};

export default HelpMessage;
