import type { AddressParam } from './addressParams';

export interface ValidatorStability {
  address: AddressParam;
  blocks_validated_count: number;
  state: 'active' | 'probation' | 'inactive';
}

export interface ValidatorsStabilityResponse {
  items: Array<ValidatorStability>;
  next_page_params: {
    address_hash: string;
    blocks_validated: string;
    items_count: string;
    state: ValidatorStability['state'];
  } | null;
}

export interface ValidatorsStabilityCountersResponse {
  active_validators_counter: string;
  active_validators_percentage: number;
  new_validators_counter_24h: string;
  validators_counter: string;
}

export interface ValidatorsStabilityFilters {
  // address_hash: string | undefined; // right now API doesn't support filtering by address_hash
  state_filter: ValidatorStability['state'] | undefined;
}

export interface ValidatorsStabilitySorting {
  sort: 'state' | 'blocks_validated';
  order: 'asc' | 'desc';
}

export type ValidatorsStabilitySortingField = ValidatorsStabilitySorting['sort'];

export type ValidatorsStabilitySortingValue = `${ ValidatorsStabilitySortingField }-${ ValidatorsStabilitySorting['order'] }`;

export interface ValidatorBlackfort {
  address: AddressParam;
  name: string;
  commission: number;
  delegated_amount: string;
  self_bonded_amount: string;
}

export interface ValidatorsBlackfortResponse {
  items: Array<ValidatorBlackfort>;
  next_page_params: {
    address_hash: string;
  } | null;
}

export interface ValidatorsBlackfortCountersResponse {
  new_validators_counter_24h: string;
  validators_counter: string;
}

export interface ValidatorsBlackfortSorting {
  sort: 'address_hash';
  order: 'asc' | 'desc';
}

export type ValidatorsBlackfortSortingField = ValidatorsBlackfortSorting['sort'];

export type ValidatorsBlackfortSortingValue = `${ ValidatorsBlackfortSortingField }-${ ValidatorsBlackfortSorting['order'] }`;

export interface GetStakerReponse {
  data: {
    stakers: Array<SingleStakerReponse>;
  };
}

export interface GetRwaBurnResponse {
  data: { ftmBurnedTotalAmount: number };
}

export interface SingleStakerReponse {
  id: `0x${ string }`;
  stakerAddress: string;
  isOffline: boolean;
  isCheater: boolean;
  isActive: boolean;
  createdTime: string;
  stake: `0x${ string }`;
  totalStake: `0x${ string }`;
  delegatedMe: `0x${ string }`;
  downtime: string;
  stakerInfo: {
    name: string;
    website: string;
    contact: string;
    logoUrl: string;
    __typename: string;
  };
  __typename: string;
}
export interface GetEpochResponse {
  data: {
    epoch: SingleEpochResponse;
  };
}
export interface SingleEpochResponse {
  actualValidatorRewards: Array<ValidatorReward>;
  endTime: string;
  epochFee: string;
  id: string;
  totalBaseRewardWeight: string;
  totalTxRewardWeight: string;
}
export interface ValidatorReward {
  id: string;
  totalReward: string;
}

export interface Validator {
  id: string;
  address: AddressParam;
  staker_name: string;
  blocks_validated_count: number;
  total_rwa_staked: string;
  total_rwa_delegated: string;
  total_rwa_self_staked: string;
  total_fee_reward: string;
  state: 'active' | 'probation' | 'inactive';
}
export interface BurnInfo {
  total_rwa_burned: number;
}

export interface ValidatorsFilters {
  // address_hash: string | undefined; // right now API doesn't support filtering by address_hash
  state_filter: Validator['state'] | undefined;
}

export interface ValidatorsSorting {
  sort: 'state' | 'blocks_validated';
  order: 'asc' | 'desc';
}

export type ValidatorsSortingField = ValidatorsSorting['sort'];

export type ValidatorsSortingValue = `${ ValidatorsSortingField }-${ ValidatorsSorting['order'] }`;
