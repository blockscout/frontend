import type { TChainIndicator } from '../types';
import type * as stats from '@blockscout/stats-types';
import type { HomeStats } from 'types/api/stats';

import config from 'configs/app';

export default function getIndicatorValues(indicator: TChainIndicator, statsData?: stats.MainPageStats, statsApiData?: HomeStats) {
  const value = (() => {
    if (config.features.stats.isEnabled && indicator?.valueMicroservice && statsData) {
      return indicator.valueMicroservice(statsData);
    }

    if (statsApiData) {
      return indicator?.value(statsApiData);
    }

    return 'N/A';
  })();

  // we have diffs only for coin and second coin price charts that get data from stats api
  // so we don't check microservice data here, but may require to add it in the future
  const valueDiff = indicator?.valueDiff ? indicator.valueDiff(statsApiData) : undefined;

  return {
    value,
    valueDiff,
  };
}
