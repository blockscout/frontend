// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';
import type { AggregatedTokenInfo } from 'src/features/multichain/types/client';

export interface AddressFungibleTokensItem {
  token: schemas['Token'] | AggregatedTokenInfo;
  value: string | null;
  chain_values?: Record<string, string | null>;
}
