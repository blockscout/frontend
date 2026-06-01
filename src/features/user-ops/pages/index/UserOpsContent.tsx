// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';

import ApiFetchAlert from 'src/shared/alerts/ApiFetchAlert';
import DataList from 'src/shared/lists/DataList';
import Pagination from 'src/shared/pagination/Pagination';
import type { QueryWithPagesResult } from 'src/shared/pagination/useQueryWithPages';

import { TableContainerScrollable } from 'src/toolkit/chakra/table';

import UserOpsTable from './UserOpsTable';

type Props = {
  query: QueryWithPagesResult<'core:user_ops'>;
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
        isLoading={ query.isPlaceholderData }
        showTx={ showTx }
        showSender={ showSender }
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
    >
      { content }
    </DataList>
  );
};

export default UserOpsContent;
