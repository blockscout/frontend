import React from 'react';

import type { OptimisticL2TxnBatchesItem } from 'types/api/optimisticL2';
import type { ExcludeUndefined } from 'types/utils';

import Tag from 'ui/shared/chakra/Tag';

export interface Props {
  container: ExcludeUndefined<OptimisticL2TxnBatchesItem['batch_data_container']>;
  isLoading?: boolean;
}

const OptimisticL2TxnBatchDA = ({ container, isLoading }: Props) => {

  const text = (() => {
    switch (container) {
      case 'in_blob4844':
        return 'EIP-4844 blob';
      case 'in_calldata':
        return 'Calldata';
      case 'in_celestia':
        return 'Celestia blob';
    }
  })();

  return (
    <Tag colorScheme="yellow" isLoading={ isLoading }>
      { text }
    </Tag>
  );
};

export default React.memo(OptimisticL2TxnBatchDA);
