import * as d3 from 'd3';
import _unique from 'lodash/uniq';

import type { TimeChartData } from '../types';

export function getAxisParamsY(data: TimeChartData) {
  const min = d3.min(data, ({ items }) => d3.min(items, ({ value }) => value)) ?? 0;
  const max = d3.max(data, ({ items }) => d3.max(items, ({ value }) => value)) ?? 0;
  const scale = d3.scaleLinear()
    .domain([ min, max ])
    .nice(3);

  const ticks = scale.ticks(3);

  // console.log('__>__ ticks', scale.ticks(3));

  const formatParams = getLabelFormatParams(ticks);

  // console.table({
  //   minL: min.toLocaleString(undefined, formatParams),
  //   maxL: max.toLocaleString(undefined, formatParams),
  //   formatParams,
  // });

  return { min, max, formatParams };
}

function getLabelFormatParams(ticks: Array<number>, maximumSignificantDigits = 2): Intl.NumberFormatOptions {
  const defaults = {
    // minimumFractionDigits: 2,
    maximumFractionDigits: 3,
    // minimumSignificantDigits: 3,
    maximumSignificantDigits,
    notation: 'compact' as const,
    // trailingZeroDisplay: '',
  };

  const uniqTicksStr = _unique(ticks.map((tick) => tick.toLocaleString(undefined, defaults)));

  // const diff = max - min;
  // const indention = diff * 0;

  // const minStr = (min >= 0 && min - indention <= 0 ? 0 : min - indention).toLocaleString(undefined, defaults);
  // const maxStr = (max - indention).toLocaleString(undefined, defaults);

  // console.table({
  //   minStr,
  //   maxStr,
  //   maximumSignificantDigits,
  // });

  // const order = Math.floor(Math.log(diff) / Math.LN10 + 0.000000001); // because float math sucks like that

  // console.table({ min, max, diff, order });

  if (uniqTicksStr.length === ticks.length || maximumSignificantDigits === 8) {
    return defaults;
  }

  return getLabelFormatParams(ticks, maximumSignificantDigits + 1);
}

// export function getLabelFormat(num: number) {
//   const maximumFractionDigits = ((num: number) => {
//     if (num < 1) {
//       return 3;
//     }

//     if (num < 10) {
//       return 2;
//     }

//     if (num < 100) {
//       return 1;
//     }

//     return 0;
//   })(num);

//   return {
//     // minimumFractionDigits: 2,
//     maximumFractionDigits: 3,
//     // minimumSignificantDigits: 3,
//     maximumSignificantDigits: 3,
//     notation: 'compact' as const,
//     // trailingZeroDisplay: 'stripIfInteger',
//   };
// }
