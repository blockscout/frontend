import type { AddressParam } from 'types/api/addressParams';
import type { TokenInfo } from 'types/api/token';

export interface TransactionCelo {
  celo?: {
    gas_token: TokenInfo | null;
  };
}

export interface BlockBaseFeeCelo {
  amount: string;
  breakdown: Array<{ amount: string; percentage: number; address: AddressParam }>;
  recipient: AddressParam;
  token: TokenInfo;
}

export interface BlockCelo {
  celo?: {
    epoch_number: number;
    l1_era_finalized_epoch_number: number | null;
    base_fee?: BlockBaseFeeCelo;
  };
}
