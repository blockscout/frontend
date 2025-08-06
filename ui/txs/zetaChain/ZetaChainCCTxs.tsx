import { Box } from '@chakra-ui/react';
import React from 'react';

import type { ZetaChainCCTX, ZetaChainCCTXFilterParams } from 'types/api/zetaChain';
import type { PaginationParams } from 'ui/shared/pagination/types';

import useIsMobile from 'lib/hooks/useIsMobile';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/pagination/Pagination';

import ZetaChainCCTxsListItem from './ZetaChainCCTXListItem';
import ZetaChainCCTxsTable from './ZetaChainCCTxsTable';

type Props = {
  pagination: PaginationParams;
  top?: number;
  items?: Array<ZetaChainCCTX>;
  isPlaceholderData: boolean;
  isError: boolean;
  filters?: ZetaChainCCTXFilterParams;
  onFilterChange: <T extends keyof ZetaChainCCTXFilterParams>(field: T, val: ZetaChainCCTXFilterParams[T]) => void;
  showStatusFilter?: boolean;
};

const ZetaChainCCTxs = ({
  pagination,
  top,
  items,
  isPlaceholderData,
  isError,
  filters = {},
  onFilterChange,
  showStatusFilter = true,
}: Props) => {
  const isMobile = useIsMobile();

  const content = (
    <>
      <Box hideFrom="lg">
        { (items || []).map((item, index) => (
          <ZetaChainCCTxsListItem
            key={ item.index + (isPlaceholderData ? index : '') }
            tx={ item }
            isLoading={ isPlaceholderData }
          />
        )) }
      </Box>
      <Box hideBelow="lg">
        <ZetaChainCCTxsTable
          txs={ items ?? [] }
          top={ top || 0 }
          isLoading={ isPlaceholderData }
          filters={ filters }
          onFilterChange={ onFilterChange }
          isPlaceholderData={ isPlaceholderData }
          showStatusFilter={ showStatusFilter }
        />
      </Box>
    </>
  );

  const actionBar = (isMobile && pagination.isVisible) ? (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  ) : null;

  return (
    <DataListDisplay
      isError={ isError }
      itemsNum={ items?.length }
      emptyText="There are no transactions."
      actionBar={ actionBar }
    >
      { content }
    </DataListDisplay>
  );
};

export default ZetaChainCCTxs;
