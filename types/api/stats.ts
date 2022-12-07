export type HomeStats = {
  total_blocks: string;
  total_addresses: string;
  total_transactions: string;
  average_block_time: number;
  coin_price: string;
  total_gas_used: string;
  transactions_today: string;
  gas_used_today: string;
  gas_prices: GasPrices;
  static_gas_price: string;
  market_cap: string;
  network_utilization_percentage: number;
}

export type GasPrices = {
  average: number;
  fast: number;
  slow: number;
}

export type Stats = {
  totalBlocksAllTime: string;
}

export type Charts = {
  'chart': Array<{
    date: string;
    value: string;
  }>;
}

export enum ChartPrecision {
  'DAY' = 'DAY',
  'MONTH' = 'MONTH',
}

export type ChartPrecisionIds = keyof typeof ChartPrecision;
