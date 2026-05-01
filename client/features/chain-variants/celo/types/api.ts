import type { TokenInfo } from 'types/api/token';

export interface TransactionCelo {
  celo?: {
    gas_token: TokenInfo | null;
  };
}
