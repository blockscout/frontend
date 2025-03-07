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
}
