export type ActivityCategoryKey =
  | "EXTRACURRICULAR"
  | "EDUCATION"
  | "CONTEST_HACKATHON"
  | "SEMINAR";

export type ActivityBadgeVariant = "default" | "deadline" | "intended";

export interface CrawledActivity {
  title: string | null;
  organizer: string | null;
  summary: string | null;
  category: string | null;
  applicationStartAt: string | null;
  applicationEndAt: string | null;
  activityStartAt?: string | null;
  activityEndAt?: string | null;
  sourceUrl: string | null;
  thumbnailUrl: string | null;
  source?: string | null;
  companyName?: string | null;
  tags?: string | null;
}

export interface FrontendActivity {
  id: string;
  source: string;
  sourceUrl: string | null;
  title: string;
  companyName: string;
  summary: string | null;
  categoryKey: ActivityCategoryKey;
  categoryLabel: "대외활동" | "교육" | "공모전/해커톤" | "강연/세미나";
  imageUrl: string;
  thumbnail: string;
  startDate: string | null;
  endDate: string | null;
  activityStartDate: string | null;
  activityEndDate: string | null;
  badgeText: string;
  badgeVariant: ActivityBadgeVariant;
  isFinished: boolean;
  isBookmarked: boolean;
  label: string;
  organization: string;
  jobs: string[];
  saveCount: number;
  viewCount: number;
  raw: CrawledActivity;
}
