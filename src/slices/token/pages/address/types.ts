// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';
import type { AggregatedTokenInfo } from 'src/features/multichain/types/client';

export interface AddressFungibleTokensItem {
  readonly token: schemas['Token'] | AggregatedTokenInfo;
  readonly value: string | null;
  readonly chain_values?: Record<string, string | null>;
}
