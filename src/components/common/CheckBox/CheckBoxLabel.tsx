/**
 * 아직 미정
 * CheckBoxLabel의 네이밍 정하지 못하여 임시 지정(NewCheckBoxLabel)
 */
import CheckBox, { CheckBoxProps } from '@/components/common/CheckBox/CheckBox';
import Typography from '@/components/common/Typography';
import type { TypographyType } from '@/components/common/Typography';
import clsx from 'clsx';
import React from 'react';

const scaleClass = {
  md: {
    wrapper: 'h-[28px]',
    typography: 'Headline1Regular' as TypographyType,
    typoStyle: 'h-space-26',
  },
  sm: {
    wrapper: 'h-space-26',
    typography: 'Body1Regular' as TypographyType,
    typoStyle: 'h-6',
  },
  xs: {
    wrapper: 'h-space-24',
    typography: 'Body3Medium' as TypographyType,
    typoStyle: 'h-5',
  },
};

export interface CheckBoxLabelProps extends CheckBoxProps {
  label: string;
  id: string;
  name?: string;
  value: string;
}

const CheckBoxLabel = ({ label, id, name, value, scale = 'sm', disabled, ...props }: CheckBoxLabelProps) => {
  const { wrapper, typography, typoStyle } = scaleClass[scale];

  return (
    <label htmlFor={id} className={clsx('flex gap-2 items-center', wrapper, disabled && 'cursor-not-allowed')}>
      <CheckBox id={id} name={name} value={value} scale={scale} disabled={disabled} {...props} />
      <Typography
        type={typography}
        className={clsx(typoStyle, disabled ? 'text-gray-40 cursor-not-allowed' : 'text-gray-90 cursor-pointer')}
      >
        {label}
      </Typography>
    </label>
  );
};

export default CheckBoxLabel;
