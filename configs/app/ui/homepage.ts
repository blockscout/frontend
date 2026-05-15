// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ChainIndicatorId, HeroBannerConfig, HomeStatsWidgetId } from 'client/slices/home/types/config';
import { HOME_STATS_WIDGET_IDS } from 'client/slices/home/types/config';

import { rollup } from 'configs/app/features';
import { getEnvValue, getExternalAssetFilePath, parseEnvJson } from 'configs/app/utils';

const homePageStats: Array<HomeStatsWidgetId> = (() => {
  const parsedValue = parseEnvJson<Array<HomeStatsWidgetId>>(getEnvValue('NEXT_PUBLIC_HOMEPAGE_STATS'));

  if (!Array.isArray(parsedValue)) {
    const rollupFeature = rollup;

    if (rollupFeature.isEnabled && [ 'zkSync', 'arbitrum' ].includes(rollupFeature.type)) {
      return [ 'latest_batch', 'average_block_time', 'total_txs', 'wallet_addresses', 'gas_tracker' ];
    }

    return [ 'total_blocks', 'average_block_time', 'total_txs', 'wallet_addresses', 'gas_tracker' ];
  }

  return parsedValue.filter((item) => HOME_STATS_WIDGET_IDS.includes(item));
})();

export const homepage = Object.freeze({
  charts: parseEnvJson<Array<ChainIndicatorId>>(getEnvValue('NEXT_PUBLIC_HOMEPAGE_CHARTS')) || [],
  stats: homePageStats,
  heroBanner: parseEnvJson<HeroBannerConfig>(getEnvValue('NEXT_PUBLIC_HOMEPAGE_HERO_BANNER_CONFIG')),
  highlights: getExternalAssetFilePath('NEXT_PUBLIC_HOMEPAGE_HIGHLIGHTS_CONFIG'),
});
