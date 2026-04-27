import type { LineChartItem } from 'toolkit/components/charts/line';

export function formatDate(date: Date) {
  return date.toISOString().substring(0, 10);
}

export const sortByDateAsc = (a: Pick<LineChartItem, 'date'>, b: Pick<LineChartItem, 'date'>) => {
  return a.date.getTime() - b.date.getTime();
};
