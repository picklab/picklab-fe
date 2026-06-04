/** @format */

// 네비게이션 섹션 타입 정의
export type SNBNavigationMenusType = {
  label: string; // 메뉴 이름
  href: string; // 메뉴 경로
  activeHref?: string; // 활성화된 경로(하위 메뉴 포함)
  children?: SNBNavigationMenusType[]; // 자식 메뉴
};

export const GNBNavigationMenus = [
  { label: "대외활동", href: "/activities" },
  { label: "강연/세미나", href: "/seminar" },
  { label: "교육", href: "/education" },
  { label: "공모전/해커톤", href: "/contest" },
] as const;

// SNB 네비게이션 메뉴 데이터
export const SNBNavigationMenus: SNBNavigationMenusType[] = [
  {
    label: "MY 활동",
    href: "/profile/archive",
  },
  {
    label: "작성 글",
    href: "/profile/archive",
  },
  {
    label: "계정",
    href: "/profile/account/info",
    activeHref: "/profile/account",
    children: [
      { label: "계정관리", href: "/profile/account/info" },
      { label: "알림관리", href: "/profile/account/notification" },
    ],
  },
] as const;

export const FOOTER_MENUS = [
  { label: "서비스 소개", href: "/" },
  { label: "광고 상품", href: "/" },
  { label: "이용약관", href: "/terms" },
  { label: "개인정보처리방침", href: "/privacy" },
  { label: "사용자 피드백", href: "/" },
];
