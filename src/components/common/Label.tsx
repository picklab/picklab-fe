import Typography from '@/components/common/Typography';
import React, { LabelHTMLAttributes } from 'react';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  // 표시할 라벨 텍스트
  title: string;
  // 선택 사항 여부 (선택적으로 표시)
  optional?: boolean;
  // 필수 여부 (* 표시용)
  require?: boolean;
}

const Label = ({ title, optional = false, require = false, ...props }: LabelProps) => {
  // optional과 require가 동시에 true일 경우 경고 출력
  if (optional && require) {
    console.warn('Label 컴포넌트에 optional과 require가 동시에 true입니다.');
  }

  return (
    // input과 연결되는 label 태그
    <label {...props}>
      <Typography type="Body1Medium" className="text-gray-60">
        {title}
        {/* optional 텍스트는 스크린 리더에 읽히지 않도록 aria-hidden */}
        {optional && (
          <Typography type="Body1Medium" tag="span" className="ml-1 text-gray-60" aria-hidden="true">
            (optional)
          </Typography>
        )}
        {/* require 텍스트(*) 역시 시각적인 강조를 위한 요소로, 스크린 리더는 무시 */}
        {require && (
          <Typography type="Body1Medium" tag="span" className="ml-1 text-danger-50" aria-hidden="true">
            *
          </Typography>
        )}
      </Typography>
    </label>
  );
};

export default Label;
