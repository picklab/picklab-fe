import Typography from '@/components/common/Typography';
import clsx from 'clsx';
import React, {
  DetailedHTMLProps,
  ElementType,
  HTMLAttributes,
  LabelHTMLAttributes,
  LiHTMLAttributes,
  forwardRef,
} from 'react';

export type TagMap = {
  label: DetailedHTMLProps<LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>;
  div: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
  li: DetailedHTMLProps<LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>;
};

type LabelTag = keyof TagMap;

export interface LabelProps<T extends LabelTag = 'label'> {
  tag?: T;
  label: string;
  checked?: boolean;
  className?: string;
}

const Label = forwardRef(
  <T extends LabelTag = 'label'>(
    { tag = 'label' as T, label, className, ...props }: LabelProps<T> & TagMap[T],
    ref: React.Ref<HTMLElement>,
  ) => {
    const Component = tag as ElementType;

    return (
      <Component
        ref={ref}
        className={clsx(
          `flex justify-center items-center w-[59px] h-9 px-space-12 py-space-8 cursor-pointer 
          hover:bg-gray-5 hover:text-gray-60 rounded
          active:bg-info-10 active:text-info-70`,
          className,
        )}
        {...props}
      >
        <Typography type="Body3Medium">{label}</Typography>
      </Component>
    );
  },
) as <T extends LabelTag = 'label'>(props: LabelProps<T> & TagMap[T] & { ref?: React.Ref<HTMLElement> }) => JSX.Element;

export default Label;
