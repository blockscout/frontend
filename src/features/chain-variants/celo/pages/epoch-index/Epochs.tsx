// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';
import PageTitle from 'src/shell/page/title/PageTitle';

import { CELO_EPOCH_ITEM } from 'src/features/chain-variants/celo/stubs/epoch';

import ApiFetchAlert from 'src/shared/alerts/ApiFetchAlert';
import DataList from 'src/shared/lists/DataList';
import Pagination from 'src/shared/pagination/Pagination';
import useApiPaginatedQuery from 'src/shared/pagination/useApiPaginatedQuery';
import { generateListStub } from 'src/shared/pagination/utils';

import { TableContainerScrollable } from 'src/toolkit/chakra/table';

import EpochsTable from './EpochsTable';

const EpochsPageContent = () => {
  const epochsQuery = useApiPaginatedQuery({
    resourceName: 'core:epochs_celo',
    options: {
      placeholderData: generateListStub<'core:epochs_celo'>(CELO_EPOCH_ITEM, 50, { next_page_params: {
        number: 1739,
        items_count: 50,
      } }),
    },
  });

  const actionBar = epochsQuery.pagination.isVisible ? (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...epochsQuery.pagination }/>
    </ActionBar>
  ) : null;

  const isLoading = epochsQuery.isInitialLoading;

  const content = (() => {
    if (epochsQuery.isError) {
      return <ApiFetchAlert/>;
    }

    return epochsQuery.data?.items ? (
      <TableContainerScrollable>
        <EpochsTable
          items={ epochsQuery.data.items }
          top={ epochsQuery.pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
          isLoading={ isLoading }
          resetKey={ epochsQuery.queryHash }
        />
      </TableContainerScrollable>
    ) : null;
  })();

  return (
    <>
      <PageTitle title="Epochs" withTextAd/>
      <DataList
        isError={ epochsQuery.isError }
        itemsNum={ epochsQuery.data?.items?.length }
        emptyText="There are no epochs."
        actionBar={ actionBar }
        isTransitioning={ epochsQuery.isTransitioning }
      >
        { content }
      </DataList>
    </>
  );
};

export default EpochsPageContent;
