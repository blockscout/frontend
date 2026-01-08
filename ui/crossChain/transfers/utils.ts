import type { InterchainTransfer } from '@blockscout/interchain-indexer-types';

export const getItemKey = (data: InterchainTransfer, index?: number) => {
  return [
    data.message_id,
    data.sender?.hash,
    data.source_token?.address,
    data.source_amount,
    data.source_token?.chain_id,
    index,
  ]
    .filter((item) => item !== undefined)
    .join('-');
};
