// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { ZkSyncBatchesItem } from 'src/features/rollup/zk-sync/types/api';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import ZkSyncTxnBatchesListItem from './ZkSyncTxnBatchesListItem';

type Props = {
  items: Array<ZkSyncBatchesItem>;
  isLoading?: boolean;
  resetKey?: string;
};

const ZkSyncTxnBatchesList = ({ items, isLoading, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: items, isEnabled: !isLoading, resetKey });

  return (
    <>
      <Box>
        { items.slice(0, renderedItemsNum).map((item, index) => (
          <ZkSyncTxnBatchesListItem
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

export default ZkSyncTxnBatchesList;
