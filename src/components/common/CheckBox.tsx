import React, { InputHTMLAttributes } from 'react';
import clsx from 'clsx';
import Check from '@/components/common/Icon/assets/Check';

interface CheckBoxProps extends InputHTMLAttributes<HTMLInputElement> {
  // 에러 상태일 경우 스타일을 다르게 표시
  error?: boolean;
}

const CheckBox = ({ error, ...props }: CheckBoxProps) => {
  return (
    // 그룹 클래스를 통해 자식 요소에 상태에 따라 스타일링 적용 가능
    <div className="group">
      <label
        // label 요소를 input과 연결
        htmlFor={props.id}
        className={clsx(
          `flex items-center size-[18px] cursor-pointer p-[1px] border-[2px] rounded-sm 
           hover:border-gray-40 active:border-gray-50 
           group-has-[input:checked]:border-info-50 group-has-[input:checked]:bg-info-50 
           group-has-[input:checked]:hover:bg-info-60 group-has-[input:checked]:hover:border-info-60 
           group-has-[input:checked]:active:bg-info-70 group-has-[input:checked]:active:border-info-70 
           group-has-[input:disabled]:!bg-gray-30 group-has-[input:disabled]:!border-gray-40`,
          error && '!border-danger-50 !bg-white', // 에러 시 스타일 오버라이드
        )}
      >
        <input
          type="checkbox"
          className="peer sr-only" // 기본 체크박스는 숨기고 peer로 상태 감지
          aria-invalid={error ? 'true' : 'false'} // 접근성: 에러 상태 전달
          aria-checked={props.checked} // 접근성: 체크 여부 명시
          aria-disabled={props.disabled} // 접근성: 비활성화 여부 명시
          {...props} // 기타 props 전달
        />

        {/* 체크 아이콘. 체크되었을 때만 표시되며, 시각적 요소이므로 스크린 리더는 무시 */}
        <Check
          aria-hidden="true"
          className={clsx(
            'hidden peer-checked:inline-block size-full text-white peer-disabled:text-gray-50',
            error && '!text-danger-50', // 에러일 경우 아이콘 색상 변경
          )}
        />
      </label>
    </div>
  );
};

export default CheckBox;
