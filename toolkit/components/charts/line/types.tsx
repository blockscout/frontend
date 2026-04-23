import type * as d3 from 'd3';

export interface LineChartItemRaw {
  date: Date;
  dateLabel?: string;
  value: number | string | null;
}

export interface LineChartItem {
  date: Date;
  date_to?: Date;
  dateLabel?: string;
  value: number;
  isApproximate?: boolean;
}

export type LineChartConfig =
  | {
    type: 'line';
    color: string;
    strokeWidth?: number;
    strokeDasharray?: string;
  } |
  {
    type: 'area';
    gradient: {
      startColor: string;
      stopColor: string;
    };
  };

export interface LineChartDataItem {
  id: string;
  name: string;
  items: Array<LineChartItem>;
  charts: Array<LineChartConfig>;
  units?: string;
  valueFormatter?: (value: number) => string;
}

export type LineChartData = Array<LineChartDataItem>;

export interface LineChartAxisConfig {
  ticks?: number;
  nice?: boolean;
  noLabel?: boolean;
  scale?: {
    min?: number;
  };
  tickFormatter?: () => (d: d3.AxisDomain) => string;
}

export interface LineChartAxesConfig {
  x?: LineChartAxisConfig;
  y?: LineChartAxisConfig;
}

export type LineChartAxesConfigFn = (props: {
  isEnlarged?: boolean;
  isMobile?: boolean;
}) => LineChartAxesConfig;
