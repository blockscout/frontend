import * as d3 from 'd3';
import { maxBy, uniq } from 'es-toolkit';

import type { AxesConfig, AxisConfig, TimeChartData } from '../types';

import { MONTH, YEAR } from 'toolkit/utils/consts';

export const DEFAULT_MAXIMUM_SIGNIFICANT_DIGITS = 2;
export const DEFAULT_MAXIMUM_FRACTION_DIGITS = 3;
export const MAXIMUM_SIGNIFICANT_DIGITS_LIMIT = 8;
export const DEFAULT_LABEL_LENGTH = 5;

export interface LabelFormatParams extends Intl.NumberFormatOptions {
  maxLabelLength: number;
}

type Data = TimeChartData;

export function getAxesParams(data: Data, axesConfig?: AxesConfig) {
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

function getAxisParamsX(data: Data) {
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

  if (span > 2 * YEAR) {
    format = d3.timeFormat('%Y');
  } else if (span > 4 * MONTH) {
    format = d3.timeFormat('%b \'%y');
  } else {
    format = d3.timeFormat('%d %b');
  }

  return format(d as Date);
};

function getAxisParamsY(data: Data, config?: AxisConfig) {
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
  return num.toLocaleString(undefined, params);
};

function getYLabelFormatParams(ticks: Array<number>, maximumSignificantDigits = DEFAULT_MAXIMUM_SIGNIFICANT_DIGITS): LabelFormatParams {
  const params = {
    maximumFractionDigits: DEFAULT_MAXIMUM_FRACTION_DIGITS,
    maximumSignificantDigits,
    notation: 'compact' as const,
  };

  const uniqTicksStr = uniq(ticks.map((tick) => tick.toLocaleString(undefined, params)));
  const maxLabelLength = maxBy(uniqTicksStr, (items) => items.length)?.length ?? DEFAULT_LABEL_LENGTH;

  if (uniqTicksStr.length === ticks.length || maximumSignificantDigits === MAXIMUM_SIGNIFICANT_DIGITS_LIMIT) {
    return { ...params, maxLabelLength };
  }

  return getYLabelFormatParams(ticks, maximumSignificantDigits + 1);
}
