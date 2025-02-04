export type PoolsResponse = {
  items: Array<Pool>;
  next_page_params: {
    page_token: string;
    page_size: number;
  } | null;
};

export type Pool = {
  contract_address: string;
  chain_id: string;
  base_token_address: string;
  base_token_symbol: string;
  base_token_icon_url: string | null;
  quote_token_address: string;
  quote_token_symbol: string;
  quote_token_icon_url: string | null;
  fully_diluted_valuation_usd: string;
  market_cap_usd: string;
  liquidity: string;
  dex: {
    id: string;
    name: string;
  };
  fee?: string;
  coin_gecko_terminal_url: string;
};
