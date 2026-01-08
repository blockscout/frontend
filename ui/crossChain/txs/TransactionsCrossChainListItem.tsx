import React from 'react';

import type { InterchainMessage } from '@blockscout/interchain-indexer-types';

import { Skeleton } from 'toolkit/chakra/skeleton';

interface Props {
  data: InterchainMessage;
  isLoading?: boolean;
}

const TransactionsCrossChainListItem = ({ data, isLoading }: Props) => {
  return <Skeleton loading={ isLoading }>{ data.message_id }</Skeleton>;
};

export default React.memo(TransactionsCrossChainListItem);
