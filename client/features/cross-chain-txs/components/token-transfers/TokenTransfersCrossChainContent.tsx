// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { InterchainTransfer } from '@blockscout/interchain-indexer-types';
import type { PaginationParams } from 'client/shared/pagination/types';

import DataList, { type Props as DataListProps } from 'client/shared/lists/DataList';

import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';

import TokenTransfersCrossChainListItem from './TokenTransfersCrossChainListItem';
import TokenTransfersCrossChainTable from './TokenTransfersCrossChainTable';
import { getItemKey } from './utils';

interface Props extends Omit<DataListProps, 'children'> {
  items?: Array<InterchainTransfer>;
  isLoading?: boolean;
  pagination?: PaginationParams;
  currentAddress?: string;
  tableTop?: number;
}

const TokenTransfersCrossChainContent = ({ items, isLoading, pagination, currentAddress, tableTop, ...rest }: Props) => {

  const content = items ? (
    <>
      <Box hideFrom="lg">
        { items.map((item, index) => (
          <TokenTransfersCrossChainListItem
            key={ getItemKey(item, isLoading ? index : undefined) }
            data={ item }
            isLoading={ isLoading }
            currentAddress={ currentAddress }
            py={ 4 }
            textStyle="sm"
            rowGap="14px"
          />
        )) }
      </Box>
      <Box hideBelow="lg">
        <TokenTransfersCrossChainTable
          data={ items }
          isLoading={ isLoading }
          top={ tableTop ?? (pagination?.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0) }
          currentAddress={ currentAddress }
        />
      </Box>
    </>
  ) : null;

  return (
    <DataList
      itemsNum={ items?.length }
      emptyText="There are no cross-chain token transfers."
      emptyStateProps={{
        term: 'token transfer',
      }}
      { ...rest }
    >
      { content }
    </DataList>
  );
};

export default React.memo(TokenTransfersCrossChainContent);
