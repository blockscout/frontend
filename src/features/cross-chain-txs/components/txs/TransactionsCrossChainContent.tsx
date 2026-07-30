// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { InterchainMessage } from '@blockscout/interchain-indexer-types';
import type { PaginationParams } from 'src/shared/pagination/types';

import { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';

import DataList from 'src/shared/lists/DataList';
import type { Props as DataListProps } from 'src/shared/lists/DataList';

import TransactionsCrossChainList from './TransactionsCrossChainList';
import TransactionsCrossChainTable from './TransactionsCrossChainTable';

export interface Props extends Omit<DataListProps, 'children'> {
  items?: Array<InterchainMessage>;
  isLoading?: boolean;
  pagination?: PaginationParams;
  isTableView?: boolean;
  stickyHeader?: boolean;
  currentAddress?: string;
  resetKey?: string;
}

const TransactionsCrossChainContent = ({
  items,
  isLoading,
  pagination,
  isTableView,
  stickyHeader = true,
  currentAddress,
  resetKey,
  ...rest
}: Props) => {
  const content = items ? (
    <>
      <Box display={{ base: isTableView ? 'none' : 'block', lg: 'none' }}>
        <TransactionsCrossChainList
          items={ items }
          isLoading={ isLoading }
          currentAddress={ currentAddress }
          resetKey={ resetKey }
        />
      </Box>
      <Box
        display={{ base: isTableView ? 'block' : 'none', lg: 'block' }}
        overflowX={{ base: 'scroll', lg: 'initial' }}
        mx={{ base: -3, lg: 0 }}
        px={{ base: 3, lg: 0 }}
      >
        <TransactionsCrossChainTable
          data={ items }
          isLoading={ isLoading }
          top={ ACTION_BAR_HEIGHT_DESKTOP }
          stickyHeader={ stickyHeader }
          currentAddress={ currentAddress }
          resetKey={ resetKey }
        />
      </Box>
    </>
  ) : null;

  return (
    <DataList
      itemsNum={ items?.length }
      emptyText="There are no cross-chain transactions."
      emptyStateProps={{
        term: 'transaction',
      }}
      { ...rest }
    >
      { content }
    </DataList>
  );
};

export default React.memo(TransactionsCrossChainContent);
