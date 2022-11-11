export type Stats = {
  total_blocks: string;
  total_addresses: string;
  total_transactions: string;
  average_block_time: number;
  coin_price: string;
  total_gas_used: string;
  transactions_today: string;
  gas_used_today: string;
  gas_prices: {average: number; fast: number; slow: number};
  static_gas_price: string;
  market_cap: string;
}
