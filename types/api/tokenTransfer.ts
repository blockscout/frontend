import type { AddressParam } from './addressParams';

export interface TokenTransfer {
  type: string;
  txHash: string;
  from: AddressParam;
  to: AddressParam;
  token_address: string;
  token_symbol: string;
  token_type: string;
  total: {
    value: string;
  };
  exchange_rate: string;
}
