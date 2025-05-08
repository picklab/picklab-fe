import AlertCircle from '@/components/common/Icon/assets/AlertCircle';
import Check from '@/components/common/Icon/assets/Check';
import ChevronLeft from '@/components/common/Icon/assets/ChevronLeft';
import ChevronRight from '@/components/common/Icon/assets/ChevronRight';
import Human from '@/components/common/Icon/assets/Human';
import Search from '@/components/common/Icon/assets/Search';

import LargeCheck from '@/components/common/Icon/assets/Large/LargeCheck';
import LargeAlertCircle from '@/components/common/Icon/assets/Large/LargeAlertCircle';
import LargeChevronDown from '@/components/common/Icon/assets/Large/LargeChevronDown';
import LargeChevronLeft from '@/components/common/Icon/assets/Large/LargeChevronLeft';
import LargeChevronRight from '@/components/common/Icon/assets/Large/LargeChevronRight';
import LargeChevronUp from '@/components/common/Icon/assets/Large/LargeChevronUp';
import LargeCowBell from '@/components/common/Icon/assets/Large/LargeCowBell';
import LargeExit from '@/components/common/Icon/assets/Large/LargeExit';
import LargeHuman from '@/components/common/Icon/assets/Large/LargeHuman';
import LargeNote from '@/components/common/Icon/assets/Large/LargeNote';
import LargeRefresh from '@/components/common/Icon/assets/Large/LargeRefresh';
import LargeSearch from '@/components/common/Icon/assets/Large/LargeSearch';
import ChevronDown from '@/components/common/Icon/assets/ChevronDown';
import ChevronUp from '@/components/common/Icon/assets/ChevronUp';
import FillChevronDown from '@/components/common/Icon/assets/FillChevronDown';
import FillChevronUp from '@/components/common/Icon/assets/FillChevronUp';
import BookmarkLine from '@/components/common/Icon/assets/BookmarkLine';
import BookmarkFill from '@/components/common/Icon/assets/BookmarkFill';
import Exit from '@/components/common/Icon/assets/Exit';

export const iconMap = {
  alertCircle: AlertCircle,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
  check: Check,
  human: Human,
  search: Search,
  fillChevronDown: FillChevronDown,
  fillChevronUp: FillChevronUp,
  bookmarkLine: BookmarkLine,
  bookmarkFill: BookmarkFill,
  exit: Exit,

  largeCheck: LargeCheck,
  largeAlertCircle: LargeAlertCircle,
  largeChevronDown: LargeChevronDown,
  largeChevronLeft: LargeChevronLeft,
  largeChevronRight: LargeChevronRight,
  largeChevronUp: LargeChevronUp,
  largeCowBell: LargeCowBell,
  largeExit: LargeExit,
  largeHuman: LargeHuman,
  largeNote: LargeNote,
  largeRefresh: LargeRefresh,
  largeSearch: LargeSearch,
};

export type IconType = keyof typeof iconMap;
export const iconList = Object.keys(iconMap) as IconType[];
