export interface TimeChartItemRaw {
  date: Date;
  dateLabel?: string;
  value: number | string | null;
}

export interface TimeChartItem {
  date: Date;
  date_to?: Date;
  dateLabel?: string;
  value: number;
  isApproximate?: boolean;
}

export interface ChartMargin {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export interface ChartOffset {
  x?: number;
  y?: number;
}

export interface TimeChartDataItem {
  items: Array<TimeChartItem>;
  name: string;
  units?: string;
  color?: string;
  valueFormatter?: (value: number) => string;
}

export type TimeChartData = Array<TimeChartDataItem>;

export interface AxisConfig {
  ticks?: number;
  nice?: boolean;
  noLabel?: boolean;
}

export interface AxesConfig {
  x?: AxisConfig;
  y?: AxisConfig;
}
