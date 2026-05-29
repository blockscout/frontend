// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';

import { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';
import PageTitle from 'src/shell/page/title/PageTitle';

import { layerLabels } from 'src/features/rollup/common/utils/layer';
import OptimisticDepositsListItem from 'src/features/rollup/optimism/pages/deposits/OptimisticDepositsListItem';
import OptimisticDepositsTable from 'src/features/rollup/optimism/pages/deposits/OptimisticDepositsTable';
import { L2_DEPOSIT_ITEM } from 'src/features/rollup/optimism/stubs';

import DataList from 'src/shared/lists/DataList';
import StickyPaginationWithText from 'src/shared/pagination/StickyPaginationWithText';
import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import { generateListStub } from 'src/shared/pagination/utils';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { rightLineArrow, nbsp } from 'src/toolkit/utils/htmlEntities';

const OptimisticL2Deposits = () => {
  const { data, isError, isPlaceholderData, pagination } = useQueryWithPages({
    resourceName: 'core:optimistic_l2_deposits',
    options: {
      placeholderData: generateListStub<'core:optimistic_l2_deposits'>(
        L2_DEPOSIT_ITEM,
        50,
        {
          next_page_params: {
            items_count: 50,
            l1_block_number: 9045200,
            transaction_hash: '',
          },
        },
      ),
    },
  });

  const countersQuery = useApiQuery('core:optimistic_l2_deposits_count', {
    queryOptions: {
      placeholderData: 1927029,
    },
  });

  const content = data?.items ? (
    <>
      <Box hideFrom="lg">
        { data.items.map(((item, index) => (
          <OptimisticDepositsListItem
            key={ item.l2_transaction_hash + (isPlaceholderData ? index : '') }
            isLoading={ isPlaceholderData }
            item={ item }
          />
        ))) }
      </Box>
      <Box hideBelow="lg">
        <OptimisticDepositsTable items={ data.items } top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 } isLoading={ isPlaceholderData }/>
      </Box>
    </>
  ) : null;

  const text = (() => {
    if (countersQuery.isError) {
      return null;
    }

    return (
      <Skeleton loading={ countersQuery.isPlaceholderData } display="inline-block">
        A total of { countersQuery.data?.toLocaleString() } deposits found
      </Skeleton>
    );
  })();

  const actionBar = <StickyPaginationWithText text={ text } pagination={ pagination }/>;

  return (
    <>
      <PageTitle title={ `Deposits (${ layerLabels.parent }${ nbsp }${ rightLineArrow }${ nbsp }${ layerLabels.current })` } withTextAd/>
      <DataList
        isError={ isError }
        itemsNum={ data?.items?.length }
        emptyText="There are no deposits."
        actionBar={ actionBar }
      >
        { content }
      </DataList>
    </>
  );
};

export default OptimisticL2Deposits;
