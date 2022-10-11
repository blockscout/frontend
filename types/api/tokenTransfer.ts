import type { AddressParam } from './addressParams';

export type TokenTransfer = (
  {
    type: 'token_transfer';
    total: {
      value: string;
    };
  } |
  {
    type: 'token_minting';
    total: {
      token_id: string;
    };
  }
) & TokenTransferBase

interface TokenTransferBase {
  txHash: string;
  from: AddressParam;
  to: AddressParam;
  token_address: string;
  token_symbol: string;
  token_type: string;
  exchange_rate: string;
}
