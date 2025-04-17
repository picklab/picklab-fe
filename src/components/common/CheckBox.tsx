import React, { InputHTMLAttributes, useId } from 'react';
import Check from './Icon/assets/Check';
import clsx from 'clsx';

interface CheckBoxProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const CheckBox = ({ error, ...props }: CheckBoxProps) => {
  return (
    <div className="group">
      <label
        htmlFor={props.id}
        className={clsx(
          `flex items-center size-[18px] cursor-pointer p-[1px] border-[2px] rounded-sm 
                    hover:border-gray-40 active:border-gray-50 
                   group-has-[input:checked]:border-info-50 group-has-[input:checked]:bg-info-50 
                   group-has-[input:checked]:hover:bg-info-60 group-has-[input:checked]:hover:border-info-60 
                   group-has-[input:checked]:active:bg-info-70 group-has-[input:checked]:active:border-info-70 
                   group-has-[input:disabled]:!bg-gray-30 group-has-[input:disabled]:!border-gray-40`,
          error && '!border-danger-50 !bg-white',
        )}
      >
        <input
          type="checkbox"
          className="peer sr-only"
          aria-invalid={error ? 'true' : 'false'}
          aria-checked={props.checked}
          aria-disabled={props.disabled}
          {...props}
        />
        <Check
          aria-hidden="true"
          className={clsx(
            'hidden peer-checked:inline-block size-full text-white peer-disabled:text-gray-50',
            error && '!text-danger-50',
          )}
        />
      </label>
    </div>
  );
};

export default CheckBox;
