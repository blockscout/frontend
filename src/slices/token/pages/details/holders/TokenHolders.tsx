// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';

import { getTokenHoldersStub } from 'src/slices/token/stubs';

import CsvExport from 'src/features/csv-export/components/CsvExport';

import ApiFetchAlert from 'src/shared/alerts/ApiFetchAlert';
import DataList from 'src/shared/lists/DataList';
import Pagination from 'src/shared/pagination/Pagination';
import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';

import TokenHoldersList from './TokenHoldersList';
import TokenHoldersTable from './TokenHoldersTable';

interface Props {
  token: schemas['Token'] | undefined;
  tokenId?: string;
  isLoading: boolean;
};

const TokenHolders = ({ token, tokenId, isLoading }: Props) => {

  const holdersQuery = useQueryWithPages({
    resourceName: tokenId ? 'core:token_instance_holders' : 'core:token_holders',
    pathParams: { hash: token?.address_hash, id: tokenId },
    options: {
      enabled: Boolean(token?.address_hash) && !isLoading,
      placeholderData: getTokenHoldersStub(token?.type, null),
    },
  });

  if (holdersQuery.isError) {
    return <ApiFetchAlert/>;
  }

  const actionBar = (
    <ActionBar mt={ -6 }>
      { token && (
        <CsvExport
          type="token_holders"
          resourceName="core:token_csv_export_holders"
          pathParams={{ hash: token.address_hash }}
          extraParams={{ token_name: token.name || 'Unknown token' }}
          periodFilter={ false }
          loadingInitial={ holdersQuery.pagination.isLoading }
        />
      ) }
      { holdersQuery.pagination.isVisible && <Pagination ml="auto" { ...holdersQuery.pagination }/> }
    </ActionBar>
  );

  const items = holdersQuery.data?.items;

  const content = items && token ? (
    <>
      <Box display={{ base: 'none', lg: 'block' }}>
        <TokenHoldersTable
          data={ items }
          token={ token }
          top={ ACTION_BAR_HEIGHT_DESKTOP }
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
    <DataList
      isError={ holdersQuery.isError }
      itemsNum={ holdersQuery.data?.items.length }
      emptyText="There are no holders for this token."
      actionBar={ actionBar }
    >
      { content }
    </DataList>
  );
};

export default TokenHolders;
