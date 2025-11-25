import Banner from './_components/Banner';
import PcActivityList from './_components/pc/ActivityList';
import NewActivityList from './_components/pc/NewActivityList';
import Pagination from '@/components/common/Pagination/Pagination';
import clsx from 'clsx';
import MobileActivityList from './_components/mobile/ActivityList';

// 상수 정의
const ACTIVITY_TITLES = {
  RECOMMENDED: '00 직무를 위한 추천 활동',
  POPULAR: '이번주 인기 대외활동',
  RECENT: '최근에 본 활동',
  NEW: '방금 올라온 따끈따끈한 활동!',
} as const;

const PAGINATION_CONFIG = {
  TOTAL_PAGE: 10,
  ACTIVE_PAGE: 1,
} as const;

// 스타일 상수
const MOBILE_STYLES = {
  CONTAINER: 'flex flex-col pb-[113px]',
  FIRST_SECTION: 'mt-5',
  SECOND_SECTION: 'mt-10',
  THIRD_SECTION: 'mt-[60px]',
} as const;

const PC_STYLES = {
  CONTAINER: 'flex flex-col gap-10 px-5 pb-20',
  CONTENT_WRAPPER: 'flex flex-col items-center justify-center gap-[60px]',
  HIDDEN_ON_MOBILE: 'mobile:hidden',
  HIDDEN_ON_PC: 'pc:hidden',
} as const;

// 타입 정의
interface ResponsiveLayoutProps {
  className: string;
  isStorybook?: boolean;
}

export default function HomePage() {
  return (
    <>
      <MobileLayout className={PC_STYLES.HIDDEN_ON_PC} />
      <PcLayout className={PC_STYLES.HIDDEN_ON_MOBILE} />
    </>
  );
}

export function MobileLayout({ className }: ResponsiveLayoutProps) {
  return (
    <div className={clsx(MOBILE_STYLES.CONTAINER, className)}>
      <Banner />
      <MobileActivityList title={ACTIVITY_TITLES.RECOMMENDED} className={MOBILE_STYLES.FIRST_SECTION} />
      <MobileActivityList title={ACTIVITY_TITLES.POPULAR} type="list" className={MOBILE_STYLES.SECOND_SECTION} />
      <MobileActivityList title={ACTIVITY_TITLES.NEW} className={MOBILE_STYLES.THIRD_SECTION} isSelect />
    </div>
  );
}

export function PcLayout({ className, isStorybook }: ResponsiveLayoutProps) {
  return (
    <div className={clsx(PC_STYLES.CONTAINER, isStorybook ? 'flex' : className)}>
      <div className={PC_STYLES.CONTENT_WRAPPER}>
        <Banner />
        <PcActivityList title={ACTIVITY_TITLES.RECOMMENDED} />
        <PcActivityList title={ACTIVITY_TITLES.POPULAR} type="list" />
        <PcActivityList title={ACTIVITY_TITLES.RECENT} />
        <NewActivityList title={ACTIVITY_TITLES.NEW} />
      </div>
      <Pagination totalPage={PAGINATION_CONFIG.TOTAL_PAGE} activePage={PAGINATION_CONFIG.ACTIVE_PAGE} />
    </div>
  );
}
