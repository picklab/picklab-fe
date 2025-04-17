import AlertCircle from '@/components/common/Icon/assets/AlertCircle';
import Check from '@/components/common/Icon/assets/Check';
import ChevronLeft from '@/components/common/Icon/assets/ChevronLeft';
import ChevronRight from '@/components/common/Icon/assets/ChevronRight';

export const iconMap = {
  alertCircle: AlertCircle,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  check: Check,
};

export type IconType = keyof typeof iconMap;
export const iconList = Object.keys(iconMap) as IconType[];
