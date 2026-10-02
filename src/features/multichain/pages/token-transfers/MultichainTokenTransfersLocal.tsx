// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { TokenType } from 'src/slices/token/types/api';

import ActionBar from 'src/shell/page/action-bar/ActionBar';

import TokenTransfersTable from 'src/slices/token-transfer/components/table/TokenTransfersTable';
import { getDefaultColumnIds } from 'src/slices/token-transfer/utils/columns';
import TokenTypeFilter from 'src/slices/token/components/TokenTypeFilter';

import { useMultichainContext } from 'src/features/multichain/context';

import PopoverFilter from 'src/shared/filters/PopoverFilter';
import useIsMobile from 'src/shared/hooks/useIsMobile';
import DataList from 'src/shared/lists/DataList';
import Pagination from 'src/shared/pagination/Pagination';
import type { ApiPaginatedQueryResult } from 'src/shared/pagination/useApiPaginatedQuery';

const COLUMNS = getDefaultColumnIds('index');

interface Props {
  query: ApiPaginatedQueryResult<'core:token_transfers_all'>;
  typeFilter: Array<TokenType>;
  onTokenTypesChange: (value: Array<TokenType>) => void;
}

const MultichainTokenTransfersLocal = ({ query, typeFilter, onTokenTypesChange }: Props) => {

  const isMobile = useIsMobile();
  const multichainContext = useMultichainContext();
  const chainData = multichainContext?.chain;

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
      isTransitioning={ query.isTransitioning }
    >
      <TokenTransfersTable
        surface="index"
        columns={ COLUMNS }
        items={ query.data?.items }
        isLoading={ query.isInitialLoading }
        resetKey={ query.queryHash }
        enableTimeIncrement
      />
    </DataList>
  );
};

export default React.memo(MultichainTokenTransfersLocal);
