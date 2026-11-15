export interface LocalApiActivityItem {
  id: string;
  title: string;
  organizer: string;
  activityType: string;
  thumbnailImage: string;
  registrationPeriod: string;
  activityPeriod: string;
  detailLink: string;
  activityField: string;
  companyType: string;
  jobs: string[];
  saveCount: number;
  viewCount: number;
  isBookmarked?: boolean;
}

export type ActivityRouteSlug = 'activities' | 'seminar' | 'education' | 'contest';
export type ActivityMenuId = 'all' | 'external-activity' | 'seminar' | 'education' | 'contest';
export type ActivityPageFilters = Record<string, string[]>;
