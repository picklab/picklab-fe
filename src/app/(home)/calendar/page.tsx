import CalendarPage from './_components/CalendarPage';
import MobileCalendarPage from './_components/MobileCalendarPage';

// 일정관리(캘린더) 진입점 — GNB 캘린더 아이콘 → /calendar (figma 2527-24643)
// PC/모바일 분기 렌더(CSS hidden/pc:block, mobile:block/pc:hidden)
export default function Page() {
  return (
    <>
      <CalendarPage />
      <MobileCalendarPage />
    </>
  );
}
