// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Text } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import useApiQuery from 'client/api/hooks/useApiQuery';

import { ACTION_BAR_HEIGHT_DESKTOP } from 'client/shell/page/action-bar/ActionBar';
import PageTitle from 'client/shell/page/title/PageTitle';

import DataList from 'client/shared/lists/DataList';
import StickyPaginationWithText from 'client/shared/pagination/StickyPaginationWithText';
import useQueryWithPages from 'client/shared/pagination/useQueryWithPages';
import { generateListStub } from 'client/shared/pagination/utils';

import config from 'configs/app';
import { Skeleton } from 'toolkit/chakra/skeleton';

import { DEPOSIT } from '../../stubs/deposits';
import BeaconChainDepositsListItem from './BeaconChainDepositsListItem';
import BeaconChainDepositsTable from './BeaconChainDepositsTable';

const feature = config.features.beaconChain;

const BeaconChainDeposits = () => {
  const { data, isError, isPlaceholderData, pagination } = useQueryWithPages({
    resourceName: 'general:deposits',
    options: {
      placeholderData: generateListStub<'general:deposits'>(DEPOSIT, 50, { next_page_params: {
        index: 5,
        items_count: 50,
      } }),
    },
  });

  const countersQuery = useApiQuery('general:deposits_counters', {
    queryOptions: {
      placeholderData: {
        deposits_count: '19091878',
      },
    },
  });

  const content = data?.items ? (
    <>
      <Box hideFrom="lg">
        { data.items.map(((item, index) => (
          <BeaconChainDepositsListItem
            key={ item.index + (isPlaceholderData ? String(index) : '') }
            item={ item }
            view="list"
            isLoading={ isPlaceholderData }
          />
        ))) }
      </Box>
      <Box hideBelow="lg">
        <BeaconChainDepositsTable
          items={ data.items }
          view="list"
          top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
          isLoading={ isPlaceholderData }
        />
      </Box>
    </>
  ) : null;

  const text = (() => {
    if (countersQuery.isError || !feature.isEnabled || feature.withdrawalsOnly) {
      return null;
    }

    return (
      <Skeleton loading={ countersQuery.isPlaceholderData || isPlaceholderData } display="flex" flexWrap="wrap">
        { countersQuery.data && (
          <Text lineHeight={{ base: '24px', lg: '32px' }}>
            { BigNumber(countersQuery.data.deposits_count).toFormat() } deposits processed
          </Text>
        ) }
      </Skeleton>
    );
  })();

  const actionBar = <StickyPaginationWithText text={ text } pagination={ pagination }/>;

  return (
    <>
      <PageTitle
        title={ config.meta.seo.enhancedDataEnabled ? `${ config.chain.name } deposits` : 'Deposits' }
        withTextAd
      />
      <DataList
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText="There are no deposits."
        actionBar={ actionBar }
      >
        { content }
      </DataList>
    </>
  );
};

export default BeaconChainDeposits;
