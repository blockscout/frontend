import * as d3 from 'd3';

import { ChartResolution } from '../../types';

export function getDateLabel(date: Date, dateTo?: Date, resolution?: ChartResolution): string {
  switch (resolution) {
    case ChartResolution.WEEK:
      return d3.utcFormat('%e %b %Y')(date) + (dateTo ? ` – ${ d3.utcFormat('%e %b %Y')(dateTo) }` : '');
    case ChartResolution.MONTH:
      return d3.utcFormat('%b %Y')(date);
    case ChartResolution.YEAR:
      return d3.utcFormat('%Y')(date);
    default:
      return d3.utcFormat('%e %b %Y')(date);
  }
}
