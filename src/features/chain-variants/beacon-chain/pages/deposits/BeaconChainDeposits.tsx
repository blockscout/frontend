// SPDX-License-Identifier: LicenseRef-Blockscout

import { Text } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';

import { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';
import PageTitle from 'src/shell/page/title/PageTitle';

import config from 'src/config';
import DataList from 'src/shared/lists/DataList';
import StickyPaginationWithText from 'src/shared/pagination/StickyPaginationWithText';
import useApiPaginatedQuery from 'src/shared/pagination/useApiPaginatedQuery';
import { generateListStub } from 'src/shared/pagination/utils';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { TableContainerScrollable } from 'src/toolkit/chakra/table';

import { DEPOSIT } from '../../stubs/deposits';
import BeaconChainDepositsTable from './BeaconChainDepositsTable';

const feature = config.features.beaconChain;

const BeaconChainDeposits = () => {
  const { data, isError, isInitialLoading, isTransitioning, pagination, queryHash } = useApiPaginatedQuery({
    resourceName: 'core:deposits',
    options: {
      placeholderData: generateListStub<'core:deposits'>(DEPOSIT, 50, { next_page_params: {
        index: 5,
        items_count: 50,
      } }),
    },
  });

  const countersQuery = useApiQuery('core:deposits_counters', {
    queryOptions: {
      placeholderData: {
        deposits_count: 19091878,
      },
    },
  });

  const content = data?.items ? (
    <TableContainerScrollable>
      <BeaconChainDepositsTable
        items={ data.items }
        view="list"
        top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
        isLoading={ isInitialLoading }
        resetKey={ queryHash }
      />
    </TableContainerScrollable>
  ) : null;

  const text = (() => {
    if (countersQuery.isError || !feature.isEnabled || feature.withdrawalsOnly) {
      return null;
    }

    return (
      <Skeleton loading={ countersQuery.isPlaceholderData || isInitialLoading } display="flex" flexWrap="wrap">
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
      <PageTitle title="Deposits" withTextAd/>
      <DataList
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText="There are no deposits."
        actionBar={ actionBar }
        isTransitioning={ isTransitioning }
      >
        { content }
      </DataList>
    </>
  );
};

export default BeaconChainDeposits;
