// SPDX-License-Identifier: LicenseRef-Blockscout

import * as d3 from 'd3';
import { maxBy, uniq } from 'es-toolkit';

import { ChartResolution } from '../../types';
import type { LineChartAxesConfig, LineChartAxisConfig, LineChartData } from '../types';

import { DAY, YEAR } from '../../../../utils/consts';

export const DEFAULT_MAXIMUM_SIGNIFICANT_DIGITS = 2;
export const DEFAULT_MAXIMUM_FRACTION_DIGITS = 3;
export const MAXIMUM_SIGNIFICANT_DIGITS_LIMIT = 8;
export const DEFAULT_LABEL_LENGTH = 5;
export const DEFAULT_TICKS_NUM_X = 4;
const MIN_MONTH_GAP = 28 * DAY;

export interface LabelFormatParams extends Intl.NumberFormatOptions {
  maxLabelLength: number;
}

type Data = LineChartData;

export function getAxesParams(data: Data, axesConfig?: LineChartAxesConfig, resolution?: ChartResolution) {
  const { labelFormatParams: labelFormatParamsY, scale: yScale } = getAxisParamsY(data, axesConfig?.y, axesConfig?.y?.tickFormatter);
  const { scale: xScale, tickValues: xTickValues } = getAxisParamsX(data, axesConfig?.x, resolution);

  return {
    x: {
      scale: xScale,
      tickValues: xTickValues,
      tickFormatter: axesConfig?.x?.tickFormatter ?? getTickFormatterX(xTickValues, resolution),
    },
    y: {
      scale: yScale,
      labelFormatParams: labelFormatParamsY,
      tickFormatter: axesConfig?.y?.tickFormatter ?? getTickFormatterY(labelFormatParamsY),
    },
  };
}

function getAxisParamsX(data: Data, config?: LineChartAxisConfig, resolution?: ChartResolution) {
  const min = d3.min(data, ({ items }) => d3.min(items, ({ date }) => date)) ?? new Date();
  const max = d3.max(data, ({ items }) => d3.max(items, ({ date }) => date)) ?? new Date();
  const scale = d3.scaleUtc().domain([ min, max ]);
  const tickValues = getTickValuesX(data, scale, config?.ticks ?? DEFAULT_TICKS_NUM_X, resolution);

  return { min, max, scale, tickValues };
}

export function getTickValuesX(
  data: Data,
  scale: d3.ScaleTime<number, number>,
  maxTicks: number,
  resolution?: ChartResolution,
): Array<Date> {
  if (resolution) {
    const dataPoints = uniq(data.flatMap(({ items }) => items.map(({ date }) => date.getTime()))).sort((a, b) => a - b);
    if (dataPoints.length <= maxTicks) {
      return dataPoints.map((time) => new Date(time));
    }
  }

  return scale.ticks(maxTicks);
}

export function getTickFormatX(ticks: Array<Date>, resolution?: ChartResolution): (date: Date) => string {
  const gaps = ticks.slice(1).map((tick, index) => tick.getTime() - ticks[index].getTime());
  const gap = d3.min(gaps);

  if (gap === undefined) {
    return getTickFormatXByResolution(resolution);
  }

  if (gap >= YEAR) {
    return d3.utcFormat('%Y');
  } else if (gap >= MIN_MONTH_GAP) {
    return d3.utcFormat('%b \'%y');
  } else if (gap >= DAY) {
    return d3.utcFormat('%d %b');
  }

  const span = ticks[ticks.length - 1].getTime() - ticks[0].getTime();
  return span >= DAY ? d3.utcFormat('%d %b %H:%M') : d3.utcFormat('%H:%M');
}

function getTickFormatXByResolution(resolution?: ChartResolution): (date: Date) => string {
  switch (resolution) {
    case ChartResolution.YEAR:
      return d3.utcFormat('%Y');
    case ChartResolution.MONTH:
      return d3.utcFormat('%b \'%y');
    default:
      return d3.utcFormat('%d %b');
  }
}

const getTickFormatterX = (ticks: Array<Date>, resolution?: ChartResolution) => (): (d: d3.AxisDomain) => string => {
  const format = getTickFormatX(ticks, resolution);
  return (d: d3.AxisDomain) => format(d as Date);
};

function getAxisParamsY(data: Data, config?: LineChartAxisConfig, tickFormatter?: () => (d: d3.AxisDomain) => string) {
  const DEFAULT_TICKS_NUM = 3;
  const min = d3.min(data, ({ items }) => d3.min(items, ({ value }) => value)) ?? 0;
  const max = d3.max(data, ({ items }) => d3.max(items, ({ value }) => value)) ?? 0;
  const scale = config?.nice ?
    d3.scaleLinear()
      .domain([ config?.scale?.min ?? min, max ])
      .nice(config?.ticks ?? DEFAULT_TICKS_NUM) :
    d3.scaleLinear()
      .domain([ config?.scale?.min ?? min, max ]);

  const ticks = scale.ticks(config?.ticks ?? DEFAULT_TICKS_NUM);
  const labelFormatParams = getYLabelFormatParams(ticks, tickFormatter);

  return { min, max, scale, labelFormatParams };
}

const getTickFormatterY = (params: Intl.NumberFormatOptions) => () => (d: d3.AxisDomain) => {
  const num = Number(d);
  return num.toLocaleString(undefined, params);
};

function getYLabelFormatParams(
  ticks: Array<number>,
  tickFormatter?: () => (d: d3.AxisDomain) => string,
  maximumSignificantDigits = DEFAULT_MAXIMUM_SIGNIFICANT_DIGITS,
): LabelFormatParams {
  const params = {
    maximumFractionDigits: DEFAULT_MAXIMUM_FRACTION_DIGITS,
    maximumSignificantDigits,
    notation: 'compact' as const,
  };

  const uniqTicksStr = uniq(ticks.map((tick) => tickFormatter ? tickFormatter()(tick) : tick.toLocaleString(undefined, params)));
  const maxLabelLength = maxBy(uniqTicksStr, (items) => items.length)?.length ?? DEFAULT_LABEL_LENGTH;

  if (uniqTicksStr.length === ticks.length || maximumSignificantDigits === MAXIMUM_SIGNIFICANT_DIGITS_LIMIT) {
    return { ...params, maxLabelLength };
  }

  return getYLabelFormatParams(ticks, tickFormatter, maximumSignificantDigits + 1);
}
