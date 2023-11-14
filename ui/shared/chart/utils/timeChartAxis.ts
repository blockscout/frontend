import * as d3 from 'd3';
import _unique from 'lodash/uniq';

import type { AxesConfig, AxisConfig, TimeChartData } from '../types';

import { WEEK, MONTH, YEAR } from 'lib/consts';

export const DEFAULT_MAXIMUM_SIGNIFICANT_DIGITS = 2;
export const DEFAULT_MAXIMUM_FRACTION_DIGITS = 3;
export const MAXIMUM_SIGNIFICANT_DIGITS_LIMIT = 8;

export function getAxisParams(data: TimeChartData, axesConfig?: AxesConfig) {
  const { labelFormatParams: labelFormatParamsY, scale: yScale } = getAxisParamsY(data, axesConfig?.y);

  return {
    x: {
      scale: getAxisParamsX(data).scale,
      tickFormatter: tickFormatterX,
    },
    y: {
      scale: yScale,
      labelFormatParams: labelFormatParamsY,
      tickFormatter: getTickFormatterY(labelFormatParamsY),
    },
  };
}

function getAxisParamsX(data: TimeChartData) {
  const min = d3.min(data, ({ items }) => d3.min(items, ({ date }) => date)) ?? new Date();
  const max = d3.max(data, ({ items }) => d3.max(items, ({ date }) => date)) ?? new Date();
  const scale = d3.scaleTime().domain([ min, max ]);

  return { min, max, scale };
}

const tickFormatterX = (axis: d3.Axis<d3.NumberValue>) => (d: d3.AxisDomain) => {
  let format: (date: Date) => string;
  const scale = axis.scale();
  const extent = scale.domain();

  const span = Number(extent[1]) - Number(extent[0]);

  if (span > YEAR) {
    format = d3.timeFormat('%Y');
  } else if (span > 2 * MONTH) {
    format = d3.timeFormat('%b');
  } else if (span > WEEK) {
    format = d3.timeFormat('%b %d');
  } else {
    format = d3.timeFormat('%a %d');
  }

  return format(d as Date);
};

function getAxisParamsY(data: TimeChartData, config?: AxisConfig) {
  const DEFAULT_TICKS_NUM = 3;
  const min = d3.min(data, ({ items }) => d3.min(items, ({ value }) => value)) ?? 0;
  const max = d3.max(data, ({ items }) => d3.max(items, ({ value }) => value)) ?? 0;
  const scale = config?.nice ?
    d3.scaleLinear()
      .domain([ min, max ])
      .nice(config?.ticks ?? DEFAULT_TICKS_NUM) :
    d3.scaleLinear()
      .domain([ min, max ]);

  const ticks = scale.ticks(config?.ticks ?? DEFAULT_TICKS_NUM);
  const labelFormatParams = getYLabelFormatParams(ticks);

  return { min, max, scale, labelFormatParams };
}

const getTickFormatterY = (params: Intl.NumberFormatOptions) => () => (d: d3.AxisDomain) => {
  const num = Number(d);

  if (num < 1) {
    // for small number there are no algorithm to format label right now
    // so we set it to 3 digits after dot maximum
    return num.toLocaleString(undefined, { maximumFractionDigits: 3 });
  }

  return num.toLocaleString(undefined, params);
};

function getYLabelFormatParams(ticks: Array<number>, maximumSignificantDigits = DEFAULT_MAXIMUM_SIGNIFICANT_DIGITS): Intl.NumberFormatOptions {
  const params = {
    maximumFractionDigits: 3,
    maximumSignificantDigits,
    notation: 'compact' as const,
  };

  const uniqTicksStr = _unique(ticks.map((tick) => tick.toLocaleString(undefined, params)));

  if (uniqTicksStr.length === ticks.length || maximumSignificantDigits === MAXIMUM_SIGNIFICANT_DIGITS_LIMIT) {
    return params;
  }

  return getYLabelFormatParams(ticks, maximumSignificantDigits + 1);
}
