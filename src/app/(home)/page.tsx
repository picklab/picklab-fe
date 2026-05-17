/** @format */

import Banner from "./_components/Banner";
import PcActivityList from "./_components/pc/ActivityList";
import NewActivityList from "./_components/pc/NewActivityList";
import Pagination from "@/components/common/Pagination/Pagination";
import clsx from "clsx";
import MobileActivityList from "./_components/mobile/ActivityList";
import { getAllActivities } from "@/lib/activity-data";
import Link from "next/link";
import Typography from "@/components/common/Typography";
import { cookies } from "next/headers";
import Search from "@/components/common/Field/Search";


// 상수 정의
const ACTIVITY_TITLES = {
  RECOMMENDED: "00 직무를 위한 추천 활동",
  POPULAR: "이번주 인기 대외활동",
  RECENT: "최근에 본 활동",
  NEW: "방금 올라온 따끈따끈한 활동!",
} as const;

const PC_NEW_ACTIVITY_PAGE_SIZE = 12;

// 스타일 상수
const MOBILE_STYLES = {
  CONTAINER: "flex flex-col pb-[113px]",
  FIRST_SECTION: "mt-5",
  SECOND_SECTION: "mt-10",
  THIRD_SECTION: "mt-[60px]",
} as const;

const PC_STYLES = {
  CONTAINER: "flex flex-col gap-[5rem] px-5 pb-20",
  CONTENT_WRAPPER: "flex flex-col items-center justify-center gap-[100px]",
  HIDDEN_ON_MOBILE: "mobile:hidden",
  HIDDEN_ON_PC: "pc:hidden",
} as const;

// 타입 정의
interface ResponsiveLayoutProps {
  className: string;
  isStorybook?: boolean;
  isLogin?: boolean;
}

interface HomePageProps {
  searchParams?: Promise<{ page?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const cookieStore = await cookies();
  const isLogin = !!(cookieStore.get("accessToken") || cookieStore.get("refreshToken"));
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const requestedPage = Number(resolvedSearchParams?.page ?? "1");
  const totalPage = Math.max(1, Math.ceil(getAllActivities().length / PC_NEW_ACTIVITY_PAGE_SIZE));
  const activePage = Number.isFinite(requestedPage) ? Math.min(Math.max(requestedPage, 1), totalPage) : 1;
  // const response = await fetchWithAuth(
  //   "http://localhost:3000/api/activities?category=EXTRACURRICULAR&sort=LATEST&size=20&page=1"
  // ).then((res) => res.json());

  // const popularResponse = await fetchWithAuth("http://localhost:3000/api/activities/popular?size=20&page=1").then(
  //   (res) => res.json()
  // );

  // const recentlyViewedResponse = await fetchWithAuth(
  //   "http://localhost:3000/api/activities/recently-viewed?size=20&page=1"
  // ).then((res) => res.json());

  // const recommendationsResponse = await fetchWithAuth(
  //   "http://localhost:3000/api/activities/recommendations?size=20&page=1"
  // ).then((res) => res.json());



  return (
    <>
      <MobileLayout className={PC_STYLES.HIDDEN_ON_PC} isLogin={isLogin} />
      <PcLayout className={PC_STYLES.HIDDEN_ON_MOBILE} totalPage={totalPage} activePage={activePage} isLogin={isLogin} />
    </>
  );
}

export function MobileLayout({ className, isLogin = true }: ResponsiveLayoutProps) {
  return (
    <div className={clsx(MOBILE_STYLES.CONTAINER, className)}>
      <div className="py-[13px]">
        <Link href="/search" aria-label="검색 화면으로 이동">
          <Search
            status="default"
            wrapperClassName="w-full"
            className="!w-full !rounded-[6px] !border-[#00BC7D] hover:!border-[#00BC7D] active:!border-[#00BC7D] focus:!border-[#00BC7D]"
            iconClassName="!text-[#00BC7D]"
            placeholder="찾고 싶은 활동을 검색해보세요"
            readOnly
          />
        </Link>
      </div>
      <Banner />
      <MobileHomeTabs />
      {isLogin && (
        <MobileActivityList title={ACTIVITY_TITLES.RECOMMENDED} endpoint="recommendations" className={MOBILE_STYLES.FIRST_SECTION} />
      )}
      <MobileActivityList title={ACTIVITY_TITLES.POPULAR} endpoint="popular" type="list" className={MOBILE_STYLES.SECOND_SECTION} />
      <MobileActivityList title={ACTIVITY_TITLES.NEW} endpoint="latest" className={MOBILE_STYLES.THIRD_SECTION} isSelect />
    </div>
  );
}

const MOBILE_HOME_TABS = [
  { label: "홈", href: "/" },
  { label: "대외활동", href: "/activities" },
  { label: "강연/세미나", href: "/seminar" },
  { label: "교육", href: "/education" },
  { label: "공모전/해커톤", href: "/contest" },
] as const;

function MobileHomeTabs() {
  return (
    <div className="relative left-1/2 mt-5 flex h-[35px] w-screen -translate-x-1/2 flex-row overflow-x-auto px-5 hide-scrollbar before:absolute before:left-0 before:right-0 before:bottom-0 before:h-[1.5px] before:bg-gray-30 before:content-['']">
      {MOBILE_HOME_TABS.map((item) => {
        const isActive = item.href === "/";

        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "relative flex shrink-0 items-center justify-center",
              isActive &&
                "after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[3px] after:translate-y-1/2 after:bg-primary-50 after:content-['']",
            )}
          >
            <Typography className="w-[86px] text-center" type="Body2Medium">
              {item.label}
            </Typography>
          </Link>
        );
      })}
    </div>
  );
}

export function PcLayout({
  className,
  isStorybook,
  totalPage,
  activePage,
  isLogin = true,
}: ResponsiveLayoutProps & { totalPage: number; activePage: number; isLogin?: boolean }) {
  return (
    <div className={clsx(PC_STYLES.CONTAINER, isStorybook ? "flex" : className)}>
      <div className={PC_STYLES.CONTENT_WRAPPER}>
        <div className="mt-[40px] w-full">
          <Banner />
        </div>
        {/* 직무를 위한 추천 활동 */}
        {isLogin && <PcActivityList title={ACTIVITY_TITLES.RECOMMENDED} endpoint="recommendations" />}
        {/* 이번주 인기 대외활동 */}
        <PcActivityList title={ACTIVITY_TITLES.POPULAR} endpoint="popular" type="list" />
        {/* 최근에 본 활동 */}
        {isLogin && <PcActivityList title={ACTIVITY_TITLES.RECENT} endpoint="recently-viewed" />}
        {/* 방금 올라온 따끈따끈한 활동! */}
        <NewActivityList title={ACTIVITY_TITLES.NEW} useExternalPagination />
      </div>
      {totalPage > 1 && <Pagination totalPage={totalPage} activePage={activePage} />}
    </div>
  );
}
