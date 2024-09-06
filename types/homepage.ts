export const CHAIN_INDICATOR_IDS = [ 'daily_txs', 'coin_price', 'secondary_coin_price', 'market_cap', 'tvl' ] as const;
export type ChainIndicatorId = typeof CHAIN_INDICATOR_IDS[number];

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
