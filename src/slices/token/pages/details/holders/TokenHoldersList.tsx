// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';

import ApiFetchAlert from 'src/shared/alerts/ApiFetchAlert';
import DataList from 'src/shared/lists/DataList';

import { TableContainerScrollable } from 'src/toolkit/chakra/table';

import TokenHoldersTable from './TokenHoldersTable';
import type { TokenHoldersQuery } from './useTokenHoldersQuery';

interface Props {
  token: schemas['Token'] | undefined;
  query: TokenHoldersQuery;
  actionBar: React.ReactNode;
}

const TokenHoldersList = ({ token, query, actionBar }: Props) => {
  if (query.isError) {
    return <ApiFetchAlert/>;
  }

  const items = query.data?.items;

  const content = items && token ? (
    <TableContainerScrollable>
      <TokenHoldersTable
        data={ items }
        token={ token }
        top={ ACTION_BAR_HEIGHT_DESKTOP }
        isLoading={ query.isInitialLoading }
        resetKey={ query.queryHash }
      />
    </TableContainerScrollable>
  ) : null;

  return (
    <DataList
      isError={ query.isError }
      itemsNum={ query.data?.items.length }
      emptyText="There are no holders for this token."
      actionBar={ actionBar }
      isTransitioning={ query.isTransitioning }
    >
      { content }
    </DataList>
  );
};

export default React.memo(TokenHoldersList);
