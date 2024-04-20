import React from 'react';

import type { BlockType } from 'types/api/block';

import useIsMobile from 'lib/hooks/useIsMobile';
import BlocksTable from 'ui/blocks/BlocksTable';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/pagination/Pagination';
import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';

interface Props {
  type?: BlockType;
  query: QueryWithPagesResult<'blocks'>;
}

const BlocksContent = ({ query }: Props) => {
  const isMobile = useIsMobile();
  const content = query.data?.items ? (
    <BlocksTable
      data={ query.data.items }
      top={ query.pagination.isVisible ? 80 : 0 }
      page={ query.pagination.page }
      isLoading={ query.isPlaceholderData }
    />
  ) : null;

  const actionBar = isMobile && query.pagination.isVisible ? (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...query.pagination }/>
    </ActionBar>
  ) : null;

  return (
    <DataListDisplay
      isError={ query.isError }
      items={ query.data?.items }
      emptyText="There are no blocks."
      content={ content }
      actionBar={ actionBar }
    />
  );
};

export default React.memo(BlocksContent);
