import dayjs from 'dayjs';

export const getFormatDate = (date: Date, format: string = 'YY.MM.DD') => {
  return date ? dayjs(date).format(format) : '';
};
