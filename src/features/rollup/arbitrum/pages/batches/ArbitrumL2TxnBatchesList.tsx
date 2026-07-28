// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import ArbitrumL2TxnBatchesListItem from './ArbitrumL2TxnBatchesListItem';

type Props = {
  items: Array<schemas['ArbitrumBatchForList']>;
  isLoading?: boolean;
  resetKey?: string;
};

const ArbitrumL2TxnBatchesList = ({ items, isLoading, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: items, isEnabled: !isLoading, resetKey });

  return (
    <>
      <Box>
        { items.slice(0, renderedItemsNum).map((item, index) => (
          <ArbitrumL2TxnBatchesListItem
            key={ item.number + (isLoading ? String(index) : '') }
            item={ item }
            isLoading={ isLoading }
          />
        )) }
      </Box>
      <Box ref={ cutRef } h={ 0 }/>
    </>
  );
};

export default ArbitrumL2TxnBatchesList;
