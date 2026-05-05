import Image from 'next/image';
import CardChip, { CardChipProps } from '../CardChip';
import CardDayBadge from '../CardDayBadge';
import Icon from '../../Icon/Icon';
import clsx from 'clsx';
import Typography from '../../Typography';
import CardJobChip from '../CardJobChip';

interface CardProps {
  imageUrl: string;
  badgeText: string;
  badgeVariant: 'default' | 'deadline' | 'intended';
  isBookmarked: boolean;
  chipText: CardChipProps['text'];
  companyName: string;
  title: string;
  jobs: ('기획' | '개발' | '마케팅' | '디자인' | 'AI')[];
  onBookmarkClick?: (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>) => void;
  onCardClick: () => void;
}

const Card = ({
  imageUrl,
  badgeText,
  badgeVariant,
  isBookmarked,
  chipText,
  companyName,
  title,
  jobs,
  onBookmarkClick,
  onCardClick,
}: CardProps) => {
  return (
    <div
      onClick={onCardClick}
      aria-label={`카드: ${title}`}
      className="flex flex-col min-w-[158px] h-[301px] rounded-[10px] bg-white cursor-pointer"
    >
      {/* 이미지 영역 */}
      <div className="relative w-full h-40 overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          width={250}
          height={180}
          className="w-full h-full object-cover rounded-[10px]"
        />
        <CardDayBadge text={badgeText} variant={badgeVariant} className="absolute top-[0.625rem] left-3" />

        <button
          onClick={(e) => {
            e.stopPropagation();
            onBookmarkClick?.(e);
          }}
          aria-pressed={isBookmarked}
          aria-label={isBookmarked ? '북마크 취소' : '북마크 추가'}
          className="absolute top-[10px] right-3"
        >
          <Icon
            icon={isBookmarked ? 'bookmarkFill' : 'bookmarkLine'}
            className={clsx('w-6 h-6', isBookmarked ? 'text-primary-50' : 'text-gray-10')}
          />
        </button>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="flex flex-col h-[141px] py-[10px] gap-[7px] ">
        <CardChip text={chipText} />
        <div className="flex flex-col gap-space-12">
          <div className="flex flex-col gap-1">
            <Typography
              type="Body3Semibold"
              className="break-keep whitespace-normal text-gray-90 leading-[143%] line-clamp-2 overflow-hidden text-ellipsis"
            >
              {title}
            </Typography>

            <Typography type="Caption2Regular" className="text-gray-90 overflow-hidden text-ellipsis whitespace-nowrap">
              {companyName}
            </Typography>
          </div>
          <div className="flex gap-[0.125rem]">
            {jobs.map((job) => (
              <CardJobChip typoType="Caption3Medium" className="px-[5px]" key={job} job={job} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
