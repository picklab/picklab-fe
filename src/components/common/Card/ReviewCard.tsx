import Button from '@/components/common/Button/Button';
import CardChip, { CardChipProps } from '@/components/common/Card/CardChip';
import { Divider } from '@/components/common/Divider/Divider';
import Typography from '@/components/common/Typography';
import React from 'react';

interface ReviewCardProps {
  title: string;
  subtitle: string;
  activityPeriod: {
    startDate: Date | string | number;
    endDate: Date | string | number;
  };
  category: CardChipProps['text'];
  buttonLabel: string;
  onButtonClick?: () => void;
}

const ReviewCard = ({ title, subtitle, activityPeriod, category, buttonLabel, onButtonClick }: ReviewCardProps) => {
  return (
    <div className="flex flex-col px-[18px] pt-[18px] pb-[16px] w-[250px] h-[190px] border border-gray-20 rounded-lg gap-space-16">
      {/* contents */}
      <div className="flex flex-col h-[100px] gap-space-10">
        <CardChip text={category} />
        <div className="flex flex-col gap-1">
          <Typography type="Body2Semibold" className="text-gray-90">
            {title}
          </Typography>
          <Typography type="Caption1Medium" className="text-gray-50">
            {subtitle}
          </Typography>
        </div>
        <div className="flex h-[14px]">
          <Typography type="Caption1Regular" className="text-gray-50">
            활동기간
          </Typography>
          <Divider vertical className="h-space-10 mx-space-6 self-center" />
          <Typography type="Caption1Regular" className="text-gray-50">
            {`${activityPeriod?.startDate}`} ~ {`${activityPeriod?.endDate}`}
          </Typography>
        </div>
      </div>
      {/* footer */}
      <Button label={buttonLabel} size="base" buttonStyle="filled" onClick={onButtonClick} />
    </div>
  );
};

export default ReviewCard;
