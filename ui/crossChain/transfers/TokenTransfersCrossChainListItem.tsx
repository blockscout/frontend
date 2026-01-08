import React from 'react';

import type { InterchainTransfer } from '@blockscout/interchain-indexer-types';

import { Skeleton } from 'toolkit/chakra/skeleton';

interface Props {
  data: InterchainTransfer;
  isLoading?: boolean;
}

const TokenTransfersCrossChainListItem = ({ data, isLoading }: Props) => {
  return <Skeleton loading={ isLoading }>{ data.message_id }</Skeleton>;
};

export default React.memo(TokenTransfersCrossChainListItem);
