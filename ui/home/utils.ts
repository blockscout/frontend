import type { ReactElement } from 'react';

import type { HomeStatsWidgetId } from 'types/homepage';

import config from 'configs/app';
import type { Props as StatsWidgetProps } from 'ui/shared/stats/StatsWidget';

export type HomeStatsItem =
  | ({ id: HomeStatsWidgetId; component: ReactElement }) |
  (StatsWidgetProps & { id: HomeStatsWidgetId; component?: undefined });

export const isHomeStatsItemEnabled = <T extends { id: HomeStatsWidgetId }>(item: T) => config.UI.homepage.stats.includes(item.id);

export const sortHomeStatsItems = <T extends { id: HomeStatsWidgetId }>(a: T, b: T) => {
  const indexA = config.UI.homepage.stats.indexOf(a.id);
  const indexB = config.UI.homepage.stats.indexOf(b.id);
  if (indexA > indexB) {
    return 1;
  }
  if (indexA < indexB) {
    return -1;
  }
  return 0;
};
