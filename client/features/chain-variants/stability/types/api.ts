import type { AddressParam } from 'types/api/addressParams';
import type { TokenInfo } from 'types/api/token';

export interface TransactionStability {
  stability_fee?: {
    dapp_address: AddressParam;
    dapp_fee: string;
    token: TokenInfo;
    total_fee: string;
    validator_address: AddressParam;
    validator_fee: string;
  };
}
