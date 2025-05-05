import { Box } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { TAC_OPERATION } from 'stubs/operations';
import { generateListStub } from 'stubs/utils';
import { Skeleton } from 'toolkit/chakra/skeleton';
import TacOperationsListItem from 'ui/operations/tac/TacOperationsListItem';
import TacOperationsTable from 'ui/operations/tac/TacOperationsTable';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import StickyPaginationWithText from 'ui/shared/StickyPaginationWithText';
const TacOperations = () => {

  const operationsQuery = useQueryWithPages({
    resourceName: 'tac:operations',
    options: {
      // TODO @tom2drum add feature config
    //   enabled: config.features.validators.isEnabled,
      placeholderData: generateListStub<'tac:operations'>(
        TAC_OPERATION,
        50,
        { next_page_params: undefined },
      ),
    },
  });
  const statsQuery = useApiQuery('tac:stat_operations', {
    queryOptions: {
      placeholderData: {
        timestamp: 0,
        operations: {
          total_operations: 1234567,
          pending_operations: 0,
          processing_operations: 0,
          finalized_operations: 0,
          failed_operations: 0,
          sync_completeness: 0,
          last_timestamp: 0,
        },
      },
    },
  });

  const text = (() => {
    if (statsQuery.isError) {
      return null;
    }

    return (
      <Skeleton
        loading={ statsQuery.isPlaceholderData }
        display="inline-block"
      >
        A total of { Number(statsQuery.data?.operations?.total_operations || 0).toLocaleString() } operations found
      </Skeleton>
    );
  })();

  const actionBar = <StickyPaginationWithText text={ text } pagination={ operationsQuery.pagination }/>;

  const content = operationsQuery.data?.items ? (
    <>
      <Box hideFrom="lg">
        { operationsQuery.data.items.map(((item, index) => (
          <TacOperationsListItem
            key={ String(item.operation_id) + (operationsQuery.isPlaceholderData ? index : '') }
            isLoading={ operationsQuery.isPlaceholderData }
            item={ item }
          />
        ))) }
      </Box>
      <Box hideBelow="lg">
        <TacOperationsTable
          items={ operationsQuery.data.items }
          top={ operationsQuery.pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
          isLoading={ operationsQuery.isPlaceholderData }
        />
      </Box>
    </>
  ) : null;

  return (
    <>
      <PageTitle title="Operations" withTextAd/>
      <DataListDisplay
        isError={ operationsQuery.isError }
        itemsNum={ operationsQuery.data?.items?.length }
        emptyText="There are no operations."
        actionBar={ actionBar }
      >
        { content }
      </DataListDisplay>
    </>
  );
};

export default React.memo(TacOperations);
