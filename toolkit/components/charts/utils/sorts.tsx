import type { TimeChartItem } from '../types';

export const sortByDateDesc = (a: Pick<TimeChartItem, 'date'>, b: Pick<TimeChartItem, 'date'>) => {
  return a.date.getTime() - b.date.getTime();
};
