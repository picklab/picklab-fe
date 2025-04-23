import AlertCircle from '@/components/common/Icon/assets/AlertCircle';
import Check from '@/components/common/Icon/assets/Check';
import ChevronLeft from '@/components/common/Icon/assets/ChevronLeft';
import ChevronRight from '@/components/common/Icon/assets/ChevronRight';
import Human from '@/components/common/Icon/assets/Human';
import Search from '@/components/common/Icon/assets/Search';

export const iconMap = {
  alertCircle: AlertCircle,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  check: Check,
  human: Human,
  search: Search,
};

export type IconType = keyof typeof iconMap;
export const iconList = Object.keys(iconMap) as IconType[];
