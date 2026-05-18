// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Text } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import useApiQuery from 'client/api/hooks/useApiQuery';

import { currencyUnits } from 'client/shared/chain/units';

import config from 'configs/app';
import { generateListStub } from 'stubs/utils';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import StickyPaginationWithText from 'ui/shared/StickyPaginationWithText';
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
      <DataListDisplay
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText="There are no withdrawals."
        actionBar={ actionBar }
      >
        { content }
      </DataListDisplay>
    </>
  );
};

export default BeaconChainWithdrawals;
