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

import { Resolution as ResolutionEnum } from '@blockscout/stats-types';

export enum ChartResolution {
  DAY = ResolutionEnum.DAY,
  WEEK = ResolutionEnum.WEEK,
  MONTH = ResolutionEnum.MONTH,
  YEAR = ResolutionEnum.YEAR,
};

export const CHART_RESOLUTION_LABELS: Array<{ id: ChartResolution; title: string }> = [
  {
    id: ChartResolution.DAY,
    title: 'Day',
  },
  {
    id: ChartResolution.WEEK,
    title: 'Week',
  },
  {
    id: ChartResolution.MONTH,
    title: 'Month',
  },
  {
    id: ChartResolution.YEAR,
    title: 'Year',
  },
];
