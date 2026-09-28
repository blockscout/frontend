// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';

import { getTokenHoldersStub } from 'src/slices/token/stubs';

import CsvExport from 'src/features/csv-export/components/CsvExport';

import ApiFetchAlert from 'src/shared/alerts/ApiFetchAlert';
import DataList from 'src/shared/lists/DataList';
import Pagination from 'src/shared/pagination/Pagination';
import useApiPaginatedQuery from 'src/shared/pagination/useApiPaginatedQuery';

import { TableContainerScrollable } from 'src/toolkit/chakra/table';

import TokenHoldersTable from './TokenHoldersTable';

interface Props {
  token: schemas['Token'] | undefined;
  tokenId?: string;
  isLoading: boolean;
};

const TokenHolders = ({ token, tokenId, isLoading }: Props) => {

  const holdersQuery = useApiPaginatedQuery({
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
    <TableContainerScrollable>
      <TokenHoldersTable
        data={ items }
        token={ token }
        top={ ACTION_BAR_HEIGHT_DESKTOP }
        isLoading={ holdersQuery.isInitialLoading }
        resetKey={ holdersQuery.queryHash }
      />
    </TableContainerScrollable>
  ) : null;

  return (
    <DataList
      isError={ holdersQuery.isError }
      itemsNum={ holdersQuery.data?.items.length }
      emptyText="There are no holders for this token."
      actionBar={ actionBar }
      isTransitioning={ holdersQuery.isTransitioning }
    >
      { content }
    </DataList>
  );
};

export default TokenHolders;
