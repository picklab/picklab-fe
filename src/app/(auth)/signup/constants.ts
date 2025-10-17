import type { JobParent, JobChild } from './types';

export const SIGNUP_ICONS = [
  {
    src: '/imgs/terms_icon.svg',
    activeSrc: '/imgs/terms_active_icon.svg',
    alt: '약관동의',
  },
  {
    src: '/imgs/user_icon.svg',
    activeSrc: '/imgs/user_active_icon.svg',
    alt: '회원정보',
  },
  {
    src: '/imgs/search_icon.svg',
    activeSrc: '/imgs/search_active_icon.svg',
    alt: '관심직무',
  },
  {
    src: '/imgs/check_icon.svg',
    activeSrc: '/imgs/check_active_icon.svg',
    alt: '가입완료',
  },
];

export const EDUCATION_OPTIONS = [
  { label: '고등학교 졸업', value: 'high_school' },
  { label: '대학교 졸업', value: 'university' },
  { label: '대학원 졸업', value: 'graduate' },
  { label: '기타', value: 'other' },
];

export const GRADUATION_OPTIONS = [
  { label: '졸업', value: 'graduated' },
  { label: '재학중', value: 'enrolled' },
  { label: '휴학중', value: 'on_leave' },
];

export const EMPLOYMENT_OPTIONS = [
  { label: '재직중', value: 'employed' },
  { label: '구직중', value: 'job_seeking' },
  { label: '프리랜서', value: 'freelancer' },
  { label: '학생', value: 'student' },
  { label: '기타', value: 'other' },
];

/** 카테고리 → 하위 태그 매핑 */
export const JOB_CHILDREN: Record<JobParent, JobChild[]> = {
  기획: [
    { label: '서비스 기획', value: 'service-planning' },
    { label: '사업 개발', value: 'business-development' },
    { label: '데이터 분석', value: 'data-analysis' },
    { label: 'PM/PO', value: 'pm-po' },
  ],
  디자인: [
    { label: 'UX 디자인', value: 'ux-design' },
    { label: 'UI 디자인', value: 'ui-design' },
    { label: '웹 디자인', value: 'web-design' },
    { label: '그래픽 디자인', value: 'graphic-design' },
    { label: '브랜드 디자인', value: 'brand-design' },
  ],
  개발: [
    { label: '프론트엔드', value: 'frontend' },
    { label: '백엔드', value: 'backend' },
    { label: '풀스택', value: 'fullstack' },
    { label: '보안', value: 'security' },
    { label: '클라우드', value: 'cloud' },
    { label: 'DevOps', value: 'devops' },
    { label: 'iOS', value: 'ios' },
    { label: '안드로이드', value: 'android' },
    { label: '블록체인', value: 'blockchain' },
    { label: '게임', value: 'game' },
  ],
  마케팅: [
    { label: '브랜드 마케팅', value: 'brand-marketing' },
    { label: '콘텐츠 마케팅', value: 'content-marketing' },
    { label: '그로스 마케팅', value: 'growth-marketing' },
    { label: 'PR', value: 'pr' },
    { label: '퍼포먼스 마케팅', value: 'performance-marketing' },
  ],
  AI: [
    { label: '머신러닝', value: 'ml' },
    { label: '딥 러닝', value: 'dl' },
    { label: '컴퓨터 비전', value: 'cv' },
    { label: 'NLP', value: 'nlp' },
    { label: '데이터', value: 'data' },
  ],
} as const;

export const JOB_AREAS = [
  {
    src: '/imgs/signup/planning.png',
    alt: '기획' as JobParent,
  },
  {
    src: '/imgs/signup/design.png',
    alt: '디자인' as JobParent,
  },
  {
    src: '/imgs/signup/development.png',
    alt: '개발' as JobParent,
  },
  {
    src: '/imgs/signup/marketing.png',
    alt: '마케팅' as JobParent,
  },
  {
    src: '/imgs/signup/ai.png',
    alt: 'AI' as JobParent,
  },
];
