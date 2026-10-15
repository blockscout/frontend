// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';

export function getTokenTransferKey(item: schemas['TokenTransfer'], chainId: string | undefined): string {
  const tokenId = item.total && 'token_id' in item.total ? item.total.token_id : null;

  return [ item.transaction_hash, item.block_hash, item.log_index, tokenId, chainId ].join('_');
}
