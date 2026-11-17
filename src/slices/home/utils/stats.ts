// SPDX-License-Identifier: LicenseRef-Blockscout

import type { HomeStatsWidgetId } from 'src/slices/home/types/config';

import config from 'src/config';

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
