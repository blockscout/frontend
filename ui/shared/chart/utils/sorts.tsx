import type { TimeChartItem } from '../types';

export const sortByDateDesc = (a: TimeChartItem, b: TimeChartItem) => {
  return a.date.getTime() - b.date.getTime();
};
