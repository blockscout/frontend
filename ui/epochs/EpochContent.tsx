import { Box } from '@chakra-ui/react';
import React from 'react';

import type { BlockType } from 'types/api/block';
import type { Epoch } from 'types/api/epoch';
import type { PaginationParams } from 'ui/shared/pagination/types';

import useIsMobile from 'lib/hooks/useIsMobile';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/pagination/Pagination';
import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';

import EpochList from './EpochList';
import EpochTable from './EpochTable';

const TABS_HEIGHT = 88;

interface Props {
  epochList: Array<Epoch>;
  loading: boolean;
  pagination: PaginationParams;
  type?: BlockType;
  query:
    | QueryWithPagesResult<'blocks'>
    | QueryWithPagesResult<'optimistic_l2_txn_batch_blocks'>;
  enableSocket?: boolean;
  top?: number;
}

const EpochContent = ({
  epochList,
  loading,
  pagination,
  query,
  top,
}: Props) => {
  const isMobile = useIsMobile();
  const content = query.data?.items ? (
    <>
      <Box display={{ base: 'block', lg: 'none' }}>
        <EpochList
          key={ epochList[0]?.id }
          data={ epochList }
          isLoading={ loading }
        />
      </Box>
      <Box display={{ base: 'none', lg: 'block' }}>
        <EpochTable
          data={ epochList }
          top={ top || (query.pagination.isVisible ? TABS_HEIGHT : 0) }
          isLoading={ loading }
          page={ pagination.page }
        />
      </Box>
    </>
  ) : null;

  const actionBar = isMobile ? (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  ) : null;

  return (
    <DataListDisplay
      isError={ query.isError }
      items={ epochList }
      emptyText="There are no epochs."
      content={ content }
      actionBar={ actionBar }
    />
  );
};

export default React.memo(EpochContent);
