// SPDX-License-Identifier: LicenseRef-Blockscout

import type { GasPrices } from 'src/slices/gas/types/api';

export interface HomeStats {
  total_blocks: string;
  total_addresses: string;
  total_transactions: string;
  average_block_time: number;
  coin_image?: string | null;
  coin_price: string | null;
  coin_price_change_percentage: number | null; // e.g -6.22
  total_gas_used: string;
  transactions_today: string | null;
  gas_used_today: string;
  gas_prices: GasPrices | null;
  gas_price_updated_at: string | null;
  gas_prices_update_in: number;
  static_gas_price: string | null;
  market_cap: string | null;
  network_utilization_percentage: number;
  tvl: string | null;
  rootstock_locked_btc?: string | null;
  last_output_root_size?: string | null;
  secondary_coin_price?: string | null;
  secondary_coin_image?: string | null;
  celo?: {
    epoch_number: number;
  };
};

export interface ChartTransactionItem {
  date: string;
  transactions_count: number | null;
}

export interface ChartMarketItem {
  date: string;
  closing_price: string | null;
  market_cap?: string | null;
  tvl?: string | null;
}

export interface ChartTransactionResponse {
  chart_data: Array<ChartTransactionItem>;
}

export interface ChartMarketResponse {
  available_supply: string;
  chart_data: Array<ChartMarketItem>;
}

export interface ChartSecondaryCoinPriceResponse {
  available_supply: string;
  chart_data: Array<ChartMarketItem>;
}
