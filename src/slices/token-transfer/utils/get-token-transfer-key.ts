// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';

// An ERC-1155 batch transfer reaches the API as a single log, which the API flattens into one item
// per transferred token id — so those items share a (transaction_hash, block_hash, log_index) triple
// and only the token id tells them apart.
//
// Equal keys are not merely untidy here: React tracks pending removals in a key -> fiber map, where
// duplicates overwrite each other, and the shadowed fibers are then never unmounted. Their rows stay
// in the DOM through pagination, stacked above the rows of every page that follows.
// https://github.com/blockscout/frontend/issues/3628
export function getTokenTransferKey(item: schemas['TokenTransfer']): string {
  const tokenId = item.total && 'token_id' in item.total ? item.total.token_id : null;

  return [ item.transaction_hash, item.block_hash, item.log_index, tokenId ].join('_');
}
