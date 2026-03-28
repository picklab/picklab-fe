/** @format */

export const ACTIVITY_FILTERS = [
  {
    title: "주최기관",
    options: [
      "전체",
      "대기업",
      "중견기업",
      "중소기업",
      "공공기관/공기업",
      "외국계 기업",
      "비영리단체/협회/재단",
      "스타트업",
      "금융권",
      "병원",
      "기타",
    ],
  },
  {
    title: "참여대상",
    options: ["전체", "제한 없음", "대학생", "직장인", "기타"],
  },
  {
    title: "활동분야",
    options: [
      "전체",
      "서포터즈",
      "마케터",
      "멘토링",
      "기자단",
      "해외봉사",
      "국내봉사단",
    ],
  },
  {
    title: "모집지역",
    options: [
      "전체",
      "온라인",
      "서울",
      "경기",
      "인천",
      "강원",
      "대전",
      "세종",
      "충남",
      "충북",
      "광주",
      "전남",
      "전북",
      "대구",
      "경북",
      "부산",
      "울산",
      "경남",
      "제주",
    ],
  },
  {
    title: "관련직무",
    options: ["전체", "기획", "마케팅", "디자인", "개발", "기타"],
  },
];

export const ACTIVITIES = {
  activities: "대외활동",
  seminar: "강연/세미나",
  education: "교육",
  contest: "공모전/해커톤",
};

export const MOBILE_ACTIVITY_MENU_TO_SLUG = {
  all: "all",
  "external-activity": "activities",
  seminar: "seminar",
  education: "education",
  contest: "contest",
} as const;
