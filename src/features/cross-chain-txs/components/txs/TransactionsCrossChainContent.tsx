// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { InterchainMessage } from '@blockscout/interchain-indexer-types';
import type { PaginationParams } from 'src/shared/pagination/types';

import { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';

import DataList from 'src/shared/lists/DataList';
import type { Props as DataListProps } from 'src/shared/lists/DataList';

import TransactionsCrossChainListItem from './TransactionsCrossChainListItem';
import TransactionsCrossChainTable from './TransactionsCrossChainTable';

export interface Props extends Omit<DataListProps, 'children'> {
  items?: Array<InterchainMessage>;
  isLoading?: boolean;
  pagination?: PaginationParams;
  isTableView?: boolean;
  stickyHeader?: boolean;
  currentAddress?: string;
}

const TransactionsCrossChainContent = ({ items, isLoading, pagination, isTableView, stickyHeader = true, currentAddress, ...rest }: Props) => {
  const content = items ? (
    <>
      <Box display={{ base: isTableView ? 'none' : 'block', lg: 'none' }}>
        { items.map((item, index) => (
          <TransactionsCrossChainListItem
            key={ item.message_id + (isLoading ? index : '') }
            data={ item }
            isLoading={ isLoading }
            currentAddress={ currentAddress }
          />
        )) }
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
