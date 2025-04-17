import AlertCircle from '@/components/common/Icon/assets/AlertCircle';
import Check from '@/components/common/Icon/assets/Check';

export const iconMap = {
  alertCircle: AlertCircle,
  check: Check,
};

export type IconType = keyof typeof iconMap;
export const iconList = Object.keys(iconMap) as IconType[];
