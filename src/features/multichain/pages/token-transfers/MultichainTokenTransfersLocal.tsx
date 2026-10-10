// SPDX-License-Identifier: LicenseRef-Blockscout

import { HStack } from '@chakra-ui/react';
import React from 'react';

import type { TokenType } from 'src/slices/token/types/api';

import ActionBar from 'src/shell/page/action-bar/ActionBar';

import TokenTransfersTable from 'src/slices/token-transfer/components/table/TokenTransfersTable';
import type { TokenTransferColumnsState } from 'src/slices/token-transfer/hooks/useTokenTransferColumns';
import TokenTypeFilter from 'src/slices/token/components/TokenTypeFilter';

import { useMultichainContext } from 'src/features/multichain/context';

import PopoverFilter from 'src/shared/filters/PopoverFilter';
import useIsMobile from 'src/shared/hooks/useIsMobile';
import ColumnsButton from 'src/shared/lists/columns/ColumnsButton';
import DataList from 'src/shared/lists/DataList';
import Pagination from 'src/shared/pagination/Pagination';
import type { ApiPaginatedQueryResult } from 'src/shared/pagination/useApiPaginatedQuery';

interface Props {
  query: ApiPaginatedQueryResult<'core:token_transfers_all'>;
  typeFilter: Array<TokenType>;
  onTokenTypesChange: (value: Array<TokenType>) => void;
  columnsState: TokenTransferColumnsState;
}

const MultichainTokenTransfersLocal = ({ query, typeFilter, onTokenTypesChange, columnsState }: Props) => {

  const isMobile = useIsMobile();
  const multichainContext = useMultichainContext();
  const chainData = multichainContext?.chain;

  const actionBar = isMobile && (
    <ActionBar mt={ -6 }>
      <HStack gap={ 3 }>
        <PopoverFilter contentProps={{ w: '200px' }} appliedFiltersNum={ typeFilter.length }>
          <TokenTypeFilter<TokenType>
            onChange={ onTokenTypesChange }
            defaultValue={ typeFilter }
            category="all"
            chainConfig={ chainData?.app_config }
          />
        </PopoverFilter>
        <ColumnsButton
          tableColumns={ columnsState.selectableColumns }
          columns={ columnsState.checkedColumns }
          onChange={ columnsState.onColumnsChange }
          onOrderChange={ columnsState.onColumnsReorder }
          selected={ columnsState.isCustomized }
          onReset={ columnsState.onColumnsReset }
        />
      </HStack>
      <Pagination { ...query.pagination }/>
    </ActionBar>
  );

  return (
    <DataList
      isError={ query.isError }
      itemsNum={ query.data?.items.length }
      emptyText="There are no token transfers."
      actionBar={ actionBar }
      hasActiveFilters={ Boolean(typeFilter.length) }
      isTransitioning={ query.isTransitioning }
    >
      <TokenTransfersTable
        columns={ columnsState.columns }
        items={ query.data?.items }
        isLoading={ query.isInitialLoading }
        resetKey={ query.queryHash }
        enableTimeIncrement
      />
    </DataList>
  );
};

export default React.memo(MultichainTokenTransfersLocal);
