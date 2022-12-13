export type TokenType = 'ERC-20' | 'ERC-721' | 'ERC-1155';

export interface TokenInfo {
  address: string;
  type: TokenType;
  symbol: string | null;
  name: string | null;
  decimals: string | null;
  holders: string | null;
  exchange_rate: string | null;
  total_supply: string | null;
}

export type TokenInfoGeneric<Type extends TokenType> = Omit<TokenInfo, 'type'> & { type: Type };
