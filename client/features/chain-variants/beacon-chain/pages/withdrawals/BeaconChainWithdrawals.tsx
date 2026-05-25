// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Text } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import useApiQuery from 'client/api/hooks/useApiQuery';

import PageTitle from 'client/shell/page/title/PageTitle';

import { currencyUnits } from 'client/slices/chain/units';

import DataList from 'client/shared/lists/DataList';
import StickyPaginationWithText from 'client/shared/pagination/StickyPaginationWithText';
import useQueryWithPages from 'client/shared/pagination/useQueryWithPages';
import { generateListStub } from 'client/shared/pagination/utils';

import config from 'configs/app';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import calculateUsdValue from 'ui/shared/value/calculateUsdValue';

import { WITHDRAWAL } from '../../stubs/withdrawals';
import BeaconChainWithdrawalsListItem from './BeaconChainWithdrawalsListItem';
import BeaconChainWithdrawalsTable from './BeaconChainWithdrawalsTable';

const feature = config.features.beaconChain;

const BeaconChainWithdrawals = () => {
  const { data, isError, isPlaceholderData, pagination } = useQueryWithPages({
    resourceName: 'general:withdrawals',
    options: {
      placeholderData: generateListStub<'general:withdrawals'>(WITHDRAWAL, 50, { next_page_params: {
        index: 5,
        items_count: 50,
      } }),
    },
  });

  const countersQuery = useApiQuery('general:withdrawals_counters', {
    queryOptions: {
      placeholderData: {
        withdrawals_count: '19091878',
        withdrawals_sum: '4630710684332438',
      },
    },
  });

  const content = data?.items ? (
    <>
      <Box hideFrom="lg">
        { data.items.map(((item, index) => (
          <BeaconChainWithdrawalsListItem
            key={ item.index + (isPlaceholderData ? String(index) : '') }
            item={ item }
            view="list"
            isLoading={ isPlaceholderData }
          />
        ))) }
      </Box>
      <Box hideBelow="lg">
        <BeaconChainWithdrawalsTable
          items={ data.items }
          view="list"
          top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
          isLoading={ isPlaceholderData }
        />
      </Box>
    </>
  ) : null;

  const text = (() => {
    if (countersQuery.isError || !feature.isEnabled) {
      return null;
    }

    return (
      <Skeleton loading={ countersQuery.isPlaceholderData || isPlaceholderData } display="flex" flexWrap="wrap">
        { countersQuery.data && (
          <Text lineHeight={{ base: '24px', lg: '32px' }}>
            { BigNumber(countersQuery.data.withdrawals_count).toFormat() } withdrawals processed
            and { calculateUsdValue({ amount: countersQuery.data.withdrawals_sum }).valueStr } { currencyUnits.ether } withdrawn
          </Text>
        ) }
      </Skeleton>
    );
  })();

  const actionBar = <StickyPaginationWithText text={ text } pagination={ pagination }/>;

  return (
    <>
      <PageTitle
        title={ config.meta.seo.enhancedDataEnabled ? `${ config.chain.name } withdrawals` : 'Withdrawals' }
        withTextAd
      />
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

export default BeaconChainWithdrawals;
