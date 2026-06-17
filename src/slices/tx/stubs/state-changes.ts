import type { schemas } from '@blockscout/api-types';

import { ADDRESS_PARAMS } from 'src/slices/address/stubs/address-params';
import { TOKEN_INFO_ERC_721 } from 'src/slices/token/stubs';

export const STATE_CHANGE_MINER: schemas['StateChange'] = {
  address: ADDRESS_PARAMS,
  balance_after: '124280364215547113',
  balance_before: '123405277440098758',
  change: '875086775448355',
  is_miner: true,
  token: null,
  type: 'coin',
};

export const STATE_CHANGE_COIN: schemas['StateChange'] = {
  address: ADDRESS_PARAMS,
  balance_after: '61659392141463351540',
  balance_before: '61660292436225994690',
  change: '-900294762600000',
  is_miner: false,
  token: null,
  type: 'coin',
};

export const STATE_CHANGE_TOKEN: schemas['StateChange'] = {
  address: ADDRESS_PARAMS,
  balance_after: '43',
  balance_before: '42',
  change: '1',
  is_miner: false,
  token: TOKEN_INFO_ERC_721,
  token_id: '1621395',
  type: 'token',
};

export const TX_STATE_CHANGES: Array<schemas['StateChange']> = [
  STATE_CHANGE_MINER,
  STATE_CHANGE_COIN,
  STATE_CHANGE_TOKEN,
];
