import CheckBox, { CheckBoxProps } from '@/components/common/Field/CheckBox';
import { TagMap } from '@/components/common/Field/Label';
import Typography from '@/components/common/Typography';
import clsx from 'clsx';
import React, { ElementType, forwardRef } from 'react';

type LabelTag = keyof TagMap;

export interface CheckBoxLabelProps<T extends LabelTag = 'label'> {
  tag?: T;
  label: string;
  checked?: boolean;
  className?: string;
  checkBoxProps?: CheckBoxProps; // checkbox에 내려줄 Props
}

const CheckBoxLabel = forwardRef(
  <T extends LabelTag = 'label'>(
    { tag = 'label' as T, label, checked, className, checkBoxProps, ...labelProps }: CheckBoxLabelProps<T> & TagMap[T],
    ref: React.Ref<HTMLElement>,
  ) => {
    const Component = tag as ElementType;

    return (
      <Component
        ref={ref}
        className={clsx(
          `flex justify-center items-center w-[59px] h-9 px-space-12 py-space-10 gap-2 cursor-pointer rounded
          hover:bg-gray-5 hover:text-gray-60
          active:bg-info-10 active:text-info-70`,
          className,
          checked && '!bg-info-10 !text-info-70',
        )}
        {...labelProps}
      >
        <CheckBox {...checkBoxProps} checked={checked} />
        <Typography type="Body3Medium">{label}</Typography>
      </Component>
    );
  },
) as <T extends LabelTag = 'label'>(
  props: CheckBoxLabelProps<T> & TagMap[T] & { ref?: React.Ref<HTMLElement> },
) => JSX.Element;

export default CheckBoxLabel;
