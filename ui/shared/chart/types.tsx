export interface TimeChartItem {
  date: Date;
  value: number;
}

export interface ChartMargin {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export interface TimeChartDataItem {
  items: Array<TimeChartItem>;
  name: string;
  color: string;
}

export type TimeChartData = Array<TimeChartDataItem>;
