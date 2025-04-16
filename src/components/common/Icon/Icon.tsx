import { iconMap, IconType } from '@/components/common/Icon/assets';

export type Props = {
  icon: IconType;
  size?: number;
  className?: string;
} & React.SVGProps<SVGSVGElement>;

const Icon = ({ icon, size, className, ...props }: Props) => {
  const IconSVGComponent = iconMap[icon];

  return (
    <span>
      <IconSVGComponent width={size} height={size} className={className} {...props} />
    </span>
  );
};

export default Icon;
