// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';

import { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';
import PageTitle from 'src/shell/page/title/PageTitle';

import { layerLabels } from 'src/features/rollup/common/utils/layer';
import OptimisticL2WithdrawalsListItem from 'src/features/rollup/optimism/pages/withdrawals/OptimisticL2WithdrawalsListItem';
import OptimisticL2WithdrawalsTable from 'src/features/rollup/optimism/pages/withdrawals/OptimisticL2WithdrawalsTable';
import { L2_WITHDRAWAL_ITEM } from 'src/features/rollup/optimism/stubs';

import DataList from 'src/shared/lists/DataList';
import StickyPaginationWithText from 'src/shared/pagination/StickyPaginationWithText';
import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import { generateListStub } from 'src/shared/pagination/utils';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { rightLineArrow, nbsp } from 'src/toolkit/utils/htmlEntities';

const OptimisticL2Withdrawals = () => {
  const { data, isError, isPlaceholderData, pagination } = useQueryWithPages({
    resourceName: 'core:optimistic_l2_withdrawals',
    options: {
      placeholderData: generateListStub<'core:optimistic_l2_withdrawals'>(
        L2_WITHDRAWAL_ITEM,
        50,
        {
          next_page_params: {
            items_count: 50,
            nonce: '',
          },
        },
      ),
    },
  });

  const countersQuery = useApiQuery('core:optimistic_l2_withdrawals_count', {
    queryOptions: {
      placeholderData: 23700,
    },
  });

  const content = data?.items ? (
    <>
      <Box hideFrom="lg">
        { data.items.map(((item, index) => (
          <OptimisticL2WithdrawalsListItem
            key={ String(item.msg_nonce_version) + item.msg_nonce + (isPlaceholderData ? index : '') }
            item={ item }
            isLoading={ isPlaceholderData }
          />
        ))) }
      </Box>
      <Box hideBelow="lg">
        <OptimisticL2WithdrawalsTable items={ data.items } top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 } isLoading={ isPlaceholderData }/>
      </Box>
    </>
  ) : null;

  const text = (() => {
    if (countersQuery.isError) {
      return null;
    }

    return (
      <Skeleton
        loading={ countersQuery.isPlaceholderData }
        display="inline-block"
      >
        A total of { countersQuery.data?.toLocaleString() } withdrawals found
      </Skeleton>
    );
  })();

  const actionBar = <StickyPaginationWithText text={ text } pagination={ pagination }/>;

  return (
    <>
      <PageTitle title={ `Withdrawals (${ layerLabels.current }${ nbsp }${ rightLineArrow }${ nbsp }${ layerLabels.parent })` } withTextAd/>
      <DataList
        isError={ isError }
        itemsNum={ data?.items?.length }
        emptyText="There are no withdrawals."
        actionBar={ actionBar }
      >
        { content }
      </DataList>
    </>
  );
};

export default OptimisticL2Withdrawals;
