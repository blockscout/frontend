import { Box, Text } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import getCurrencyValue from 'lib/getCurrencyValue';
import { currencyUnits } from 'lib/units';
import { generateListStub } from 'stubs/utils';
import { WITHDRAWAL } from 'stubs/withdrawals';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import StickyPaginationWithText from 'ui/shared/StickyPaginationWithText';
import BeaconChainWithdrawalsListItem from 'ui/withdrawals/beaconChain/BeaconChainWithdrawalsListItem';
import BeaconChainWithdrawalsTable from 'ui/withdrawals/beaconChain/BeaconChainWithdrawalsTable';

const feature = config.features.beaconChain;

const Withdrawals = () => {
  const { data, isError, isPlaceholderData, pagination } = useQueryWithPages({
    resourceName: 'withdrawals',
    options: {
      placeholderData: generateListStub<'withdrawals'>(WITHDRAWAL, 50, { next_page_params: {
        index: 5,
        items_count: 50,
      } }),
    },
  });

  const countersQuery = useApiQuery('withdrawals_counters', {
    queryOptions: {
      placeholderData: {
        withdrawal_count: '19091878',
        withdrawal_sum: '4630710684332438',
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
            { BigNumber(countersQuery.data.withdrawal_count).toFormat() } withdrawals processed
            and { getCurrencyValue({ value: countersQuery.data.withdrawal_sum }).valueStr } { currencyUnits.ether } withdrawn
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

export default Withdrawals;
