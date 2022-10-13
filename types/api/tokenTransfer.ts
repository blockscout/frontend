import type { AddressParam } from './addressParams';

export type TokenTransfer = (
  {
    token_type: 'ERC-20';
    total: {
      value: string;
    };
  } |
  {
    token_type: 'ERC-721';
    total: {
      token_id: string;
    };
  } |
  {
    token_type: 'ERC-1155';
    total: {
      value: string;
      token_id: string;
    };
  } |
  {
    token_type: 'ERC-1155_batch';
    total: Array<{
      value: string;
      token_id: string;
    }>;
  }
) & TokenTransferBase

interface TokenTransferBase {
  type: 'token_transfer' | 'token_burning' | 'token_spawning' | 'token_minting';
  txHash: string;
  from: AddressParam;
  to: AddressParam;
  token_address: string;
  token_symbol: string;
  exchange_rate: string;
}
