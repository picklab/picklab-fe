import Typography from '@/components/common/Typography';
import clsx from 'clsx';
import React, { LabelHTMLAttributes } from 'react';

export const statusValue = {
  optional: { text: 'text-gray-60', title: '(optional)', screenReaderText: '선택 항목입니다.' },
  require: { text: 'text-danger-50', title: '*', screenReaderText: '필수 항목입니다.' },
};
interface LabelTypeProps extends LabelHTMLAttributes<HTMLLabelElement> {
  // 표시할 라벨 텍스트
  title: string;
  // 선택 사항 여부 (선택적으로 표시)
  status?: keyof typeof statusValue | 'default';
}

const LabelType = ({ title, status = 'default', className, ...props }: LabelTypeProps) => {
  return (
    // input과 연결되는 label 태그
    <label {...props} className={clsx('w-fit cursor-pointer', className)}>
      <Typography type="Body1Medium" className="text-gray-60 ">
        {title}
        {status !== 'default' && (
          <>
            <span className="sr-only">{statusValue[status].screenReaderText}</span>
            <Typography
              type="Body1Medium"
              tag="span"
              className={clsx('ml-1', statusValue[status].text)}
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

export default LabelType;
