export type Tokenlist = {
  message: string;
  result: Array<TokenlistItem> | string;
}

export type TokenlistItem = {
  balance: number;
  contractAddress: string;
  decimals?: number;
  id: number;
  name: string;
  symbol: string;
  type: string;
}
