import { Skeleton, Tag } from '@chakra-ui/react';
import React from 'react';

import type { ArbitrumL2TxnBatchesItem } from 'types/api/arbitrumL2';

export interface Props {
  dataContainer: ArbitrumL2TxnBatchesItem['batch_data_container'];
  isLoading?: boolean;
}

const ArbitrumL2TxnBatchDA = ({ dataContainer, isLoading }: Props) => {
  let text: string;

  if (dataContainer === null) {
    return null;
  }

  switch (dataContainer) {
    case 'in_blob4844':
      text = 'blob';
      break;
    case 'in_anytrust':
      text = 'anytrust';
      break;
    case 'in_calldata':
      text = 'calldata';
      break;
    case 'in_celestia':
      text = 'celestia';
      break;
    default:
      text = '';
  }

  if (!text) {
    return null;
  }

  return (
    <Skeleton isLoaded={ !isLoading }>
      <Tag colorScheme={ dataContainer === 'in_blob4844' ? 'yellow' : 'gray' }>
        { text }
      </Tag>
    </Skeleton>
  );
};

export default ArbitrumL2TxnBatchDA;
