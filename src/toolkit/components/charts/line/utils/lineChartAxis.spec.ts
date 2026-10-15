// SPDX-License-Identifier: LicenseRef-Blockscout

import * as d3 from 'd3';

import { ChartResolution } from '../../types';
import type { LineChartData } from '../types';

import { describe, expect, it } from 'vitest';

import { getTickFormatX, getTickValuesX } from './lineChartAxis';

function makeData(dates: Array<string>): LineChartData {
  return [ {
    id: 'chart',
    name: 'chart',
    charts: [],
    items: dates.map((date, index) => ({ date: new Date(date), value: index })),
  } ];
}

function makeScale(data: LineChartData) {
  const dates = data[0].items.map(({ date }) => date);
  return d3.scaleUtc().domain([ dates[0], dates[dates.length - 1] ]);
}

const toDay = (date: Date) => date.toISOString().slice(0, 10);
const octoberDays = Array.from({ length: 30 }, (_, i) => `2025-10-${ String(i + 1).padStart(2, '0') }`);

describe('getTickValuesX', () => {
  it('puts a tick on every data point when the data fits within the tick limit', () => {
    const data = makeData([ '2025-07-31', '2025-08-31', '2025-09-30', '2025-10-31' ]);
    const ticks = getTickValuesX(data, makeScale(data), 4, ChartResolution.MONTH);
    expect(ticks.map(toDay)).toEqual([ '2025-07-31', '2025-08-31', '2025-09-30', '2025-10-31' ]);
  });

  it('orders data-point ticks chronologically across charts', () => {
    const data = [ ...makeData([ '2025-09-30' ]), ...makeData([ '2025-07-31', '2025-08-31' ]) ];
    const ticks = getTickValuesX(data, makeScale(data), 4, ChartResolution.MONTH);
    expect(ticks.map(toDay)).toEqual([ '2025-07-31', '2025-08-31', '2025-09-30' ]);
  });

  it('falls back to calendar ticks when the data is denser than the tick limit', () => {
    const data = makeData(octoberDays);
    const ticks = getTickValuesX(data, makeScale(data), 4, ChartResolution.DAY);
    expect(ticks.map(toDay)).toEqual([ '2025-10-05', '2025-10-12', '2025-10-19', '2025-10-26' ]);
  });

  it('ignores data points without a resolution', () => {
    const data = makeData([ '2025-07-03', '2025-08-09' ]);
    const ticks = getTickValuesX(data, makeScale(data), 4);
    expect(ticks.map(toDay)).toEqual([ '2025-07-06', '2025-07-13', '2025-07-20', '2025-07-27', '2025-08-03' ]);
  });

  it('deduplicates dates shared by several charts', () => {
    const data = [ ...makeData([ '2025-07-31', '2025-08-31' ]), ...makeData([ '2025-07-31', '2025-08-31' ]) ];
    expect(getTickValuesX(data, makeScale(data), 4, ChartResolution.MONTH)).toHaveLength(2);
  });
});

describe('getTickFormatX', () => {
  const labels = (dates: Array<string>, resolution?: ChartResolution) => {
    const ticks = dates.map((date) => new Date(date));
    return ticks.map(getTickFormatX(ticks, resolution));
  };

  it('yields distinct labels for quarterly ticks over multiple years', () => {
    expect(labels([ '2024-01-01', '2024-04-01', '2024-07-01', '2024-10-01', '2025-01-01' ]))
      .toEqual([ 'Jan \'24', 'Apr \'24', 'Jul \'24', 'Oct \'24', 'Jan \'25' ]);
  });

  it('labels yearly ticks with the year only', () => {
    expect(labels([ '2023-01-01', '2024-01-01', '2025-01-01' ])).toEqual([ '2023', '2024', '2025' ]);
  });

  it('labels month-end ticks with month and year', () => {
    expect(labels([ '2025-01-31', '2025-02-28', '2025-03-31' ])).toEqual([ 'Jan \'25', 'Feb \'25', 'Mar \'25' ]);
  });

  it('labels daily ticks with day and month', () => {
    expect(labels([ '2025-10-05', '2025-10-06' ])).toEqual([ '05 Oct', '06 Oct' ]);
  });

  it('labels weekly ticks with day and month', () => {
    expect(labels([ '2025-10-05', '2025-10-12' ])).toEqual([ '05 Oct', '12 Oct' ]);
  });

  it('labels sub-day ticks with time', () => {
    expect(labels([ '2025-10-05T10:00:00Z', '2025-10-05T13:00:00Z' ])).toEqual([ '10:00', '13:00' ]);
  });

  it('labels a single tick by resolution', () => {
    expect(labels([ '2025-10-31' ], ChartResolution.MONTH)).toEqual([ 'Oct \'25' ]);
    expect(labels([ '2025-12-31' ], ChartResolution.YEAR)).toEqual([ '2025' ]);
    expect(labels([ '2025-10-31' ], ChartResolution.DAY)).toEqual([ '31 Oct' ]);
    expect(labels([ '2025-10-31' ])).toEqual([ '31 Oct' ]);
  });
});
