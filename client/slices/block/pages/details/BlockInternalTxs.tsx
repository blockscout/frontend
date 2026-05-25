// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import InternalTxsList from 'client/slices/internal-tx/components/InternalTxsList';
import InternalTxsTable from 'client/slices/internal-tx/components/InternalTxsTable';

import DataList from 'client/shared/lists/DataList';
import type { QueryWithPagesResult } from 'client/shared/pagination/useQueryWithPages';

interface Props {
  query: QueryWithPagesResult<'general:block_internal_txs'>;
  top?: number;
}

const BlockInternalTxs = ({ query, top }: Props) => {
  const { data, isPlaceholderData, isError } = query;

  const content = data?.items ? (
    <>
      <Box hideFrom="lg">
        <InternalTxsList data={ data.items } isLoading={ isPlaceholderData } showBlockInfo={ false }/>
      </Box>
      <Box hideBelow="lg">
        <InternalTxsTable data={ data.items } isLoading={ isPlaceholderData } top={ top } showBlockInfo={ false }/>
      </Box>
    </>
  ) : null;

  return (
    <DataList
      isError={ isError }
      itemsNum={ data?.items.length }
      emptyText="There are no internal transactions."
    >
      { content }
    </DataList>
  );
};

export default React.memo(BlockInternalTxs);
