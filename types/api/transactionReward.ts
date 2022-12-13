import type { AddressParam } from './addressParams';

export type TransactionReward = {
  types: Array<string>;
  emission_reward: string;
  block_hash: string;
  from: AddressParam;
  to: AddressParam;
}
