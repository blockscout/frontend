export const CHAIN_INDICATOR_IDS = [ 'daily_txs', 'daily_operational_txs', 'coin_price', 'secondary_coin_price', 'market_cap', 'tvl' ] as const;
export type ChainIndicatorId = typeof CHAIN_INDICATOR_IDS[number];

export const HOME_STATS_WIDGET_IDS = [
  'latest_batch',
  'total_blocks',
  'average_block_time',
  'total_txs',
  'total_operational_txs',
  'latest_l1_state_batch',
  'wallet_addresses',
  'gas_tracker',
  'btc_locked',
  'current_epoch',
] as const;
export type HomeStatsWidgetId = typeof HOME_STATS_WIDGET_IDS[number];

export interface HeroBannerButtonState {
  background?: Array<string | undefined>;
  text_color?: Array<string | undefined>;
}

export interface HeroBannerConfig {
  background?: Array<string | undefined>;
  text_color?: Array<string | undefined>;
  border?: Array<string | undefined>;
  button?: {
    _default?: HeroBannerButtonState;
    _hover?: HeroBannerButtonState;
    _selected?: HeroBannerButtonState;
  };
  search?: {
    border_width?: Array<string | undefined>;
  };
  text?: string;
}

import * as features from 'configs/app/features';
import { getEnvValue, getExternalAssetFilePath, parseEnvJson } from 'configs/app/utils';

const homePageStats: Array<HomeStatsWidgetId> = (() => {
  const parsedValue = parseEnvJson<Array<HomeStatsWidgetId>>(getEnvValue('NEXT_PUBLIC_HOMEPAGE_STATS'));

  if (!Array.isArray(parsedValue)) {
    const rollupFeature = features.rollup;

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
