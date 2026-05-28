// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ReactElement } from 'react';

import type { HomeStatsWidgetId } from 'client/slices/home/types/config';

import config from 'client/config';
import type { Props as StatsWidgetProps } from 'client/shared/stats/StatsWidget';

export type HomeStatsComponentItem = { id: HomeStatsWidgetId; component: ReactElement };
export type HomeStatsWidgetItem = StatsWidgetProps & { id: HomeStatsWidgetId; component?: undefined };

export type HomeStatsItem = HomeStatsComponentItem | HomeStatsWidgetItem;

export const homeStatsWidgetCommonStyles = {
  _odd: {
    _last: {
      gridColumn: 'span 2',
    },
  },
} as const;

export const isHomeStatsItemEnabled = (item: { id: HomeStatsWidgetId }) => config.slices.home.stats.includes(item.id);

export const sortHomeStatsItems = (a: { id: HomeStatsWidgetId }, b: { id: HomeStatsWidgetId }) => {
  const indexA = config.slices.home.stats.indexOf(a.id);
  const indexB = config.slices.home.stats.indexOf(b.id);
  if (indexA > indexB) {
    return 1;
  }
  if (indexA < indexB) {
    return -1;
  }
  return 0;
};
