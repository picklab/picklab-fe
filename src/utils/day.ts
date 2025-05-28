import dayjs from 'dayjs';

export const DATE_FORMAT = {
  YMD_DOT: 'YY.MM.DD',
  YMD_SLASH: 'YYYY/MM/DD',
  FULL: 'YYYY년 MM월 DD일',
  ISO: 'YYYY-MM-DDTHH:mm:ssZ',
  TIME: 'HH:mm',
} as const;

export const getFormatDate = (date: Date | string, format: keyof typeof DATE_FORMAT = 'YMD_DOT'): string => {
  const dateInstance = dayjs(date);
  return dateInstance.format(DATE_FORMAT[format]);
};
