import type { ChainIndicatorId } from 'types/homepage';

import config from 'configs/app';
import type { LineChartData, LineChartDataItem, LineChartItemRaw, LineChartItem } from 'toolkit/components/charts/line';
import { sortByDateAsc } from 'ui/shared/chart/utils';

const CHART_ITEMS: Record<ChainIndicatorId, Pick<LineChartDataItem, 'name' | 'valueFormatter'>> = {
  daily_txs: {
    name: 'Tx/day',
    valueFormatter: (x: number) => x.toLocaleString(undefined, { maximumFractionDigits: 2, notation: 'compact' }),
  },
  daily_operational_txs: {
    name: 'Tx/day',
    valueFormatter: (x: number) => x.toLocaleString(undefined, { maximumFractionDigits: 2, notation: 'compact' }),
  },
  coin_price: {
    name: `${ config.features.multichain.isEnabled ? 'ETH' : config.chain.currency.symbol } price`,
    valueFormatter: (x: number) => '$' + x.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }),
  },
  secondary_coin_price: {
    name: `${ config.chain.currency.symbol } price`,
    valueFormatter: (x: number) => '$' + x.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }),
  },
  market_cap: {
    name: 'Market cap',
    valueFormatter: (x: number) => '$' + x.toLocaleString(undefined, { maximumFractionDigits: 2 }),
  },
  tvl: {
    name: 'TVL',
    valueFormatter: (x: number) => '$' + x.toLocaleString(undefined, { maximumFractionDigits: 2, notation: 'compact' }),
  },
};

const nonNullTailReducer = (result: Array<LineChartItemRaw>, item: LineChartItemRaw) => {
  if (item.value === null && result.length === 0) {
    return result;
  }
  result.unshift(item);
  return result;
};

const mapNullToZero: (item: LineChartItemRaw) => LineChartItem = (item) => ({ ...item, value: Number(item.value) });

export function prepareChartItems(items: Array<LineChartItemRaw>) {
  return items
    .sort(sortByDateAsc)
    .reduceRight(nonNullTailReducer, [] as Array<LineChartItemRaw>)
    .map(mapNullToZero);
}

export function getChartData(indicatorId: ChainIndicatorId, data: Array<LineChartItemRaw>): LineChartData {
  return [ {
    id: indicatorId.replace(' ', '_'),
    charts: [],
    items: prepareChartItems(data),
    name: CHART_ITEMS[indicatorId].name,
    valueFormatter: CHART_ITEMS[indicatorId].valueFormatter,
  } ];
}
