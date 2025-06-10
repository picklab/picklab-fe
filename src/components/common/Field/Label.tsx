import Typography from '@/components/common/Typography';
import clsx from 'clsx';
import React, { LabelHTMLAttributes } from 'react';

export const statusValue = {
  optional: { text: 'text-gray-60', title: '(optional)', screenReaderText: '선택 항목입니다.' },
  require: { text: 'text-danger-50', title: '*', screenReaderText: '필수 항목입니다.' },
};
export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  // 표시할 라벨 텍스트
  title: string;
  // 선택 사항 여부 (선택적으로 표시)
  status?: keyof typeof statusValue | 'default';
  disable?: boolean;
}

const Label = ({ title, status = 'default', className, disable = false, ...props }: LabelProps) => {
  const disableStyle = disable ? '!text-gray-40' : '';
  return (
    // input과 연결되는 label 태그
    <label {...props} className={clsx('flex items-center w-fit cursor-pointer h-space-24', className)}>
      <Typography type="Body3Medium" className={clsx('text-gray-90', disableStyle)}>
        {title}
        {status !== 'default' && (
          <>
            <span className="sr-only">{statusValue[status].screenReaderText}</span>
            <Typography
              type="Body1Medium"
              tag="span"
              className={clsx('ml-1', statusValue[status].text, disableStyle)}
              aria-hidden="true"
            >
              {statusValue[status].title}
            </Typography>
          </>
        )}
      </Typography>
    </label>
  );
};

export default Label;
