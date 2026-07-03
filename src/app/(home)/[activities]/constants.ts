/** @format */

// 옵션명은 UX 문서(2-25064) 기준. 주최기관·참여대상·활동분야는 '전체' 없음, 지역·직무만 '모두'.
export const ACTIVITY_FILTERS = [
  {
    title: "주최기관",
    options: [
      "대기업",
      "중견기업",
      "중소기업",
      "공공기관/공기업",
      "외국계",
      "스타트업",
      "비영리/협회/재단",
      "금융권",
      "병원",
      "기타",
    ],
  },
  {
    title: "참여대상",
    options: ["제한 없음", "대학생", "직장인/일반인"],
  },
  {
    title: "활동분야",
    options: [
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
      "모두",
      "서울/인천",
      "경기/강원",
      "대전/세종/충남",
      "부산/대구/경상",
      "광주/전라",
      "제주",
      "해외",
    ],
  },
  {
    title: "관련직무",
    options: ["모두", "기획", "디자인", "개발", "마케팅", "AI"],
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
