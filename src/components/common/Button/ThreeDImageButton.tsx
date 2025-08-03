import Typography from '@/components/common/Typography';
import clsx from 'clsx';
import Image from 'next/image';
import React from 'react';
import ThreeDImagePlaceHolder from '@/../public/imgs/ThreeDImagePlaceHolder.jpg';

export interface ThreeDImageButton
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  isActive: boolean;
  imgSrc?: string;
  text: string;
}

const activeClass = {
  box: 'bg-primary-5 !border-primary-50',
  text: 'text-gray-90',
};

const ThreeDImageButton = ({ isActive, imgSrc, text, ...props }: ThreeDImageButton) => {
  return (
    <div
      className={clsx(
        'flex flex-col w-[78px] h-24 rounded-md items-center pt-2 gap-2 border border-gray-10',
        isActive && activeClass['box'],
      )}
      {...props}
    >
      <div className="relative size-12">
        <Image alt="공고 이미지" src={imgSrc || ThreeDImagePlaceHolder} fill />
      </div>
      <Typography type="Headline2Regular" className={clsx('text-gray-50', isActive && activeClass['text'])}>
        {text}
      </Typography>
    </div>
  );
};

export default ThreeDImageButton;
