import { Box } from '@chakra-ui/react';
import React from 'react';

import type { TokenInfo } from 'types/api/token';

import CsvExport from 'client/features/csv-export/components/CsvExport';
import useIsMobile from 'lib/hooks/useIsMobile';
import useIsMounted from 'lib/hooks/useIsMounted';
import ActionBar from 'ui/shared/ActionBar';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/pagination/Pagination';
import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';

import TokenHoldersList from './TokenHoldersList';
import TokenHoldersTable from './TokenHoldersTable';

const TABS_HEIGHT = 88;

type Props = {
  token?: TokenInfo;
  holdersQuery: QueryWithPagesResult<'general:token_holders'>;
  shouldRender?: boolean;
  tabsHeight?: number;
};

const TokenHolders = ({ holdersQuery, token, shouldRender = true, tabsHeight = TABS_HEIGHT }: Props) => {
  const isMobile = useIsMobile();
  const isMounted = useIsMounted();

  if (!isMounted || !shouldRender) {
    return null;
  }

  if (holdersQuery.isError) {
    return <DataFetchAlert/>;
  }

  const actionBar = isMobile && (
    <ActionBar mt={ -6 }>
      { token && (
        <CsvExport
          type="token_holders"
          resourceName="general:token_csv_export_holders"
          pathParams={{ hash: token.address_hash }}
          extraParams={{ token_name: token.name || 'Unknown token' }}
          periodFilter={ false }
          loadingInitial={ holdersQuery.pagination.isLoading }
        />
      ) }
      <Pagination ml="auto" { ...holdersQuery.pagination }/>
    </ActionBar>
  );

  const items = holdersQuery.data?.items;

  const content = items && token ? (
    <>
      <Box display={{ base: 'none', lg: 'block' }}>
        <TokenHoldersTable
          data={ items }
          token={ token }
          top={ tabsHeight }
          isLoading={ holdersQuery.isPlaceholderData }
        />
      </Box>
      <Box display={{ base: 'block', lg: 'none' }}>
        <TokenHoldersList
          data={ items }
          token={ token }
          isLoading={ holdersQuery.isPlaceholderData }
        />
      </Box>
    </>
  ) : null;

  return (
    <DataListDisplay
      isError={ holdersQuery.isError }
      itemsNum={ holdersQuery.data?.items.length }
      emptyText="There are no holders for this token."
      actionBar={ actionBar }
    >
      { content }
    </DataListDisplay>
  );
};

export default TokenHolders;
