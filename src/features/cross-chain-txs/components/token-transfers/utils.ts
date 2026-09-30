// SPDX-License-Identifier: LicenseRef-Blockscout

import type { InterchainTransfer } from '@blockscout/interchain-indexer-types';

export const getItemKey = (data: InterchainTransfer, index?: number) => {
  return [
    data.message_id,
    data.sender?.hash,
    // Null for a native token; the symbol keeps the key distinct between two native transfers of one message.
    data.source_token?.address_hash ?? data.source_token?.symbol,
    data.source_amount,
    data.source_chain?.id,
    index,
  ]
    .filter((item) => item !== undefined && item !== null)
    .join('-');
};
