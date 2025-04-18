import Typography from '@/components/common/Typography';
import clsx from 'clsx';
import React, { LabelHTMLAttributes } from 'react';
import { optional } from 'zod';

const statusValue = {
  optional: { text: 'text-gray-60', title: '(optional)', screenReaderText: '선택 항목입니다.' },
  require: { text: 'text-danger-50', title: '*', screenReaderText: '필수 항목입니다.' },
};
interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  // 표시할 라벨 텍스트
  title: string;
  // 선택 사항 여부 (선택적으로 표시)
  status?: keyof typeof statusValue | 'default';
}

const Label = ({ title, status = 'default', ...props }: LabelProps) => {
  return (
    // input과 연결되는 label 태그
    <label {...props}>
      <Typography type="Body1Medium" className="text-gray-60">
        {title}
        {/* optional 텍스트는 스크린 리더에 읽히지 않도록 aria-hidden */}
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
        {/* require 텍스트(*) 역시 시각적인 강조를 위한 요소로, 스크린 리더는 무시 */}
      </Typography>
    </label>
  );
};

export default Label;
