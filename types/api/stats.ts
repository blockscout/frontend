export type HomeStats = {
  total_blocks: string;
  total_addresses: string;
  total_transactions: string;
  average_block_time: number;
  coin_price: string;
  total_gas_used: string;
  transactions_today: string;
  gas_used_today: string;
  gas_prices: GasPrices | null;
  static_gas_price: string;
  market_cap: string;
  network_utilization_percentage: number;
}

export type GasPrices = {
  average: number;
  fast: number;
  slow: number;
}

export type Counters = {
  counters: Array<Counter>;
}

type Counter = {
  id: string;
  value: string;
  title: string;
  units: string;
}

export type Charts = {
  chart: Array<ChartsItem>;
}

export type ChartsItem ={
  date: string;
  value: string;
}
