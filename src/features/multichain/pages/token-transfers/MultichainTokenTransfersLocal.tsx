// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { TokenType } from 'src/slices/token/types/api';

import ActionBar from 'src/shell/page/action-bar/ActionBar';

import TokenTransfersListItem from 'src/slices/token-transfer/pages/index/TokenTransfersListItem';
import TokenTransfersTable from 'src/slices/token-transfer/pages/index/TokenTransfersTable';
import TokenTypeFilter from 'src/slices/token/components/TokenTypeFilter';

import { useMultichainContext } from 'src/features/multichain/context';

import PopoverFilter from 'src/shared/filters/PopoverFilter';
import useIsMobile from 'src/shared/hooks/useIsMobile';
import DataList from 'src/shared/lists/DataList';
import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';
import Pagination from 'src/shared/pagination/Pagination';
import type { QueryWithPagesResult } from 'src/shared/pagination/useQueryWithPages';

const ACTION_BAR_HEIGHT = 24 * 2 + 40;

interface Props {
  query: QueryWithPagesResult<'core:token_transfers_all'>;
  typeFilter: Array<TokenType>;
  onTokenTypesChange: (value: Array<TokenType>) => void;
}

const MultichainTokenTransfersLocal = ({ query, typeFilter, onTokenTypesChange }: Props) => {

  const isMobile = useIsMobile();
  const multichainContext = useMultichainContext();
  const chainData = multichainContext?.chain;
  const { cutRef, renderedItemsNum } = useLazyRenderedList({
    list: query.data?.items,
    isEnabled: !query.isPlaceholderData,
    resetKey: query.queryHash,
  });

  const actionBar = isMobile && (
    <ActionBar mt={ -6 }>
      <PopoverFilter contentProps={{ w: '200px' }} appliedFiltersNum={ typeFilter.length }>
        <TokenTypeFilter<TokenType>
          onChange={ onTokenTypesChange }
          defaultValue={ typeFilter }
          category="all"
          chainConfig={ chainData?.app_config }
        />
      </PopoverFilter>
      <Pagination { ...query.pagination }/>
    </ActionBar>
  );

  return (
    <DataList
      isError={ query.isError }
      itemsNum={ query.data?.items.length }
      emptyText="There are no token transfers."
      actionBar={ actionBar }
    >
      <Box hideFrom="lg">
        { query.data?.items.slice(0, renderedItemsNum).map((item, index) => (
          <TokenTransfersListItem
            key={ (item.transaction_hash ?? '') + item.log_index + (query.isPlaceholderData ? index : '') + (chainData ? chainData.id : '') }
            isLoading={ query.isPlaceholderData }
            item={ item }
            chainData={ chainData }
          />
        )) }
        <Box ref={ cutRef } h={ 0 }/>
      </Box>
      <Box hideBelow="lg">
        <TokenTransfersTable
          items={ query.data?.items }
          top={ query.pagination.isVisible ? ACTION_BAR_HEIGHT : 0 }
          isLoading={ query.isPlaceholderData }
          chainData={ chainData }
          resetKey={ query.queryHash }
        />
      </Box>
    </DataList>
  );
};

export default React.memo(MultichainTokenTransfersLocal);
