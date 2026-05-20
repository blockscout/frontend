import type {
  ValidatorsZilliqaItem,
  ValidatorZilliqa,
} from 'client/features/chain-variants/zilliqa/types/api';

import { ADDRESS_PARAMS } from 'client/slices/address/stubs/address-params';

export const VALIDATORS_ZILLIQA_ITEM: ValidatorsZilliqaItem = {
  index: 420,
  bls_public_key: '0x95125dca41be848801f9bd75254f1faf1ae3194b1da53e9a5684ed7f67b729542482bc521924603b9703c33bf831a100',
  balance: '80000000000000000000000000',
};

export const VALIDATOR_ZILLIQA: ValidatorZilliqa = {
  index: 420,
  bls_public_key: '0x95125dca41be848801f9bd75254f1faf1ae3194b1da53e9a5684ed7f67b729542482bc521924603b9703c33bf831a100',
  balance: '1000000000000000000',
  added_at_block_number: 1234567890,
  control_address: ADDRESS_PARAMS,
  peer_id: '1234567890',
  reward_address: ADDRESS_PARAMS,
  signing_address: ADDRESS_PARAMS,
  stake_updated_at_block_number: 1234567890,
};
