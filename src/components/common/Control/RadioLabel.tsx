import Radio, { RadioProps } from '@/components/common/Control/Radio';
import Typography from '@/components/common/Typography';
import type { TypographyType } from '@/components/common/Typography';
import clsx from 'clsx';
import React from 'react';

const scaleClass = {
  base: {
    wrapper: 'h-[26px]',
    typography: 'Headline1Regular' as TypographyType,
    typoStyle: 'h-5',
  },
  sm: {
    wrapper: 'h-[24px]',
    typography: 'Body1Regular' as TypographyType,
    typoStyle: 'h-4',
  },
};

interface RadioLabelProps extends RadioProps {
  label: string;
  id: string;
  name: string;
  value: string;
}

const RadioLabel = ({ label, id, name, value, scale = 'base', disabled, ...props }: RadioLabelProps) => {
  const { wrapper, typography, typoStyle } = scaleClass[scale];

  return (
    <label htmlFor={id} className={clsx('flex gap-2  items-center', wrapper, disabled && 'cursor-not-allowed')}>
      <Radio id={id} name={name} value={value} scale={scale} disabled={disabled} {...props} />
      <Typography
        type={typography}
        className={clsx(typoStyle, disabled ? 'text-gray-40 cursor-not-allowed' : 'text-gray-90 cursor-pointer')}
      >
        {label}
      </Typography>
    </label>
  );
};

export default RadioLabel;
