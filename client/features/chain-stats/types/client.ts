import type { LineChartInfo, LineChartSection } from '@blockscout/stats-types';
import type { LineChartItem } from 'toolkit/components/charts/line/types';
import type { SankeyChartData } from 'toolkit/components/charts/sankey/types';

export type ChartType = 'line' | 'sankey';

export interface ChainStatsChart extends LineChartInfo {
  resourceName?: 'interchainIndexer:stats_chain_messages_sent' | 'interchainIndexer:stats_chain_messages_received';
  type?: ChartType;
}

export interface ChainStatsSection extends Omit<LineChartSection, 'charts'> {
  charts: Array<ChainStatsChart>;
}

export interface ChainStatsPayload {
  sections: Array<ChainStatsSection>;
}

export type ChartData = {
  info?: LineChartInfo;
} & (ChartDataPayloadLine | ChartDataPayloadSankey);

export interface ChartDataPayloadLine {
  type: 'line';
  data: Array<LineChartItem>;
}

export interface ChartDataPayloadSankey {
  type: 'sankey';
  data: SankeyChartData;
}

export type StatsInterval = { id: StatsIntervalIds; title: string };

export type StatsIntervalIds = keyof typeof StatsIntervalId;

export enum StatsIntervalId {
  all,
  oneMonth,
  threeMonths,
  sixMonths,
  oneYear,
}
