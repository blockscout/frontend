// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';

import { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';
import PageTitle from 'src/shell/page/title/PageTitle';

import { layerLabels } from 'src/features/rollup/common/utils/layer';
import { SHIBARIUM_WITHDRAWAL_ITEM } from 'src/features/rollup/shibarium/stubs';

import DataList from 'src/shared/lists/DataList';
import StickyPaginationWithText from 'src/shared/pagination/StickyPaginationWithText';
import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import { generateListStub } from 'src/shared/pagination/utils';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { rightLineArrow, nbsp } from 'src/toolkit/utils/htmlEntities';

import WithdrawalsListItem from './WithdrawalsListItem';
import WithdrawalsTable from './WithdrawalsTable';

const ShibariumWithdrawals = () => {
  const { data, isError, isPlaceholderData, pagination } = useQueryWithPages({
    resourceName: 'general:shibarium_withdrawals',
    options: {
      placeholderData: generateListStub<'general:shibarium_withdrawals'>(
        SHIBARIUM_WITHDRAWAL_ITEM,
        50,
        {
          next_page_params: {
            items_count: 50,
            block_number: 123,
          },
        },
      ),
    },
  });

  const countersQuery = useApiQuery('general:shibarium_withdrawals_count', {
    queryOptions: {
      placeholderData: 23700,
    },
  });

  const content = data?.items ? (
    <>
      <Box hideFrom="lg">
        { data.items.map(((item, index) => (
          <WithdrawalsListItem
            key={ `${ item.l2_transaction_hash }-${ index }` }
            item={ item }
            isLoading={ isPlaceholderData }
          />
        ))) }
      </Box>
      <Box hideBelow="lg">
        <WithdrawalsTable items={ data.items } top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 } isLoading={ isPlaceholderData }/>
      </Box>
    </>
  ) : null;

  const text = (() => {
    if (countersQuery.isError) {
      return null;
    }

    return (
      <Skeleton loading={ countersQuery.isPlaceholderData } display="inline-block">
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
        itemsNum={ data?.items.length }
        emptyText="There are no withdrawals."
        actionBar={ actionBar }
      >
        { content }
      </DataList>
    </>
  );
};

export default ShibariumWithdrawals;
