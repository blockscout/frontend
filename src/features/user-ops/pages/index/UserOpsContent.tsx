// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';

import ApiFetchAlert from 'src/shared/alerts/ApiFetchAlert';
import DataList from 'src/shared/lists/DataList';
import Pagination from 'src/shared/pagination/Pagination';
import type { ApiPaginatedQueryResult } from 'src/shared/pagination/useApiPaginatedQuery';

import { TableContainerScrollable } from 'src/toolkit/chakra/table';

import UserOpsTable from './UserOpsTable';

type Props = {
  query: ApiPaginatedQueryResult<'core:user_ops'>;
  showTx?: boolean;
  showSender?: boolean;
};

const UserOpsContent = ({ query, showTx = true, showSender = true }: Props) => {

  if (query.isError) {
    return <ApiFetchAlert/>;
  }

  const content = query.data?.items ? (
    <TableContainerScrollable>
      <UserOpsTable
        items={ query.data.items }
        top={ query.pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
        isLoading={ query.isInitialLoading }
        showTx={ showTx }
        showSender={ showSender }
        resetKey={ query.queryHash }
      />
    </TableContainerScrollable>
  ) : null;

  const actionBar = query.pagination.isVisible ? (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...query.pagination }/>
    </ActionBar>
  ) : null;

  return (
    <DataList
      isError={ query.isError }
      itemsNum={ query.data?.items?.length }
      emptyText="There are no user operations."
      actionBar={ actionBar }
      isTransitioning={ query.isTransitioning }
    >
      { content }
    </DataList>
  );
};

export default UserOpsContent;
