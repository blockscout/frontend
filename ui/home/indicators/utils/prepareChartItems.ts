import type { TimeChartItem, TimeChartItemRaw } from 'toolkit/components/charts/types';

import { sortByDateDesc } from 'ui/shared/chart/utils';

const nonNullTailReducer = (result: Array<TimeChartItemRaw>, item: TimeChartItemRaw) => {
  if (item.value === null && result.length === 0) {
    return result;
  }
  result.unshift(item);
  return result;
};

const mapNullToZero: (item: TimeChartItemRaw) => TimeChartItem = (item) => ({ ...item, value: Number(item.value) });

export default function prepareChartItems(items: Array<TimeChartItemRaw>) {
  return items
    .sort(sortByDateDesc)
    .reduceRight(nonNullTailReducer, [] as Array<TimeChartItemRaw>)
    .map(mapNullToZero);
}
