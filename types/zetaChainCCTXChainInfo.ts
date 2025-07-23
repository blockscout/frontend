export interface ChainInfo {
  chain_id: number;
  chain_name: string | null;
  chain_logo: string | null;
  instance_url: string;
  native_currency: {
    symbol: string;
    decimals: number;
  };
}
