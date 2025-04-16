import AlertCircle from '@/components/common/Icon/assets/AlertCircle';

export const iconMap = {
  alertCircle: AlertCircle,
};

export type IconType = keyof typeof iconMap;
export const iconList = Object.keys(iconMap) as IconType[];
