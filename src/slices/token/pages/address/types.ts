// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';

export type AddressFungibleTokensItem = Pick<schemas['TokenBalance'], 'token' | 'value'> & {
  chain_values?: Record<string, string | null>;
};
