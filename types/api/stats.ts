export type HomeStats = {
  total_blocks: string;
  total_addresses: string;
  total_transactions: string;
  average_block_time: number;
  coin_price: string | null;
  coin_price_change_percentage: number | null; // e.g -6.22
  total_gas_used: string;
  transactions_today: string;
  gas_used_today: string;
  gas_prices: GasPrices | null;
  gas_price_updated_at: string | null;
  gas_prices_update_in: number;
  static_gas_price: string | null;
  market_cap: string;
  network_utilization_percentage: number;
  tvl: string | null;
  rootstock_locked_btc?: string | null;
}

export type GasPrices = {
  average: GasPriceInfo | null;
  fast: GasPriceInfo | null;
  slow: GasPriceInfo | null;
}

export interface GasPriceInfo {
  fiat_price: string | null;
  price: number | null;
  time: number | null;
  base_fee: number | null;
  priority_fee: number | null;
}

export type Counters = {
  counters: Array<Counter>;
}

export type Counter = {
  id: string;
  value: string;
  title: string;
  description?: string;
  units: string;
}

export type StatsCharts = {
  sections: Array<StatsChartsSection>;
}

export type StatsChartsSection = {
  id: string;
  title: string;
  charts: Array<StatsChartInfo>;
}

export type StatsChartInfo = {
  id: string;
  title: string;
  description: string;
  units: string | null;
}

export type StatsChart = { chart: Array<StatsChartItem> };

export type StatsChartItem = {
  date: string;
  value: string;
}
