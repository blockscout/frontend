import { Hide, Show } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import useIsMounted from 'lib/hooks/useIsMounted';
import getQueryParamString from 'lib/router/getQueryParamString';
import { EPOCH_REWARD_ITEM } from 'stubs/address';
import { generateListStub } from 'stubs/utils';
import AddressEpochRewardsTable from 'ui/address/epochRewards/AddressEpochRewardsTable';
import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

import AddressCsvExportLink from './AddressCsvExportLink';
import AddressEpochRewardsListItem from './epochRewards/AddressEpochRewardsListItem';

type Props = {
  scrollRef?: React.RefObject<HTMLDivElement>;
  shouldRender?: boolean;
  isQueryEnabled?: boolean;
};

const AddressEpochRewards = ({ scrollRef, shouldRender = true, isQueryEnabled = true }: Props) => {
  const router = useRouter();
  const isMounted = useIsMounted();

  const hash = getQueryParamString(router.query.hash);

  const rewardsQuery = useQueryWithPages({
    resourceName: 'address_epoch_rewards',
    pathParams: {
      hash,
    },
    scrollRef,
    options: {
      enabled: isQueryEnabled && Boolean(hash),
      placeholderData: generateListStub<'address_epoch_rewards'>(EPOCH_REWARD_ITEM, 50, { next_page_params: {
        amount: '1',
        items_count: 50,
        type: 'voter',
        associated_account_address_hash: '1',
        block_number: 10355938,
      } }),
    },
  });

  if (!isMounted || !shouldRender) {
    return null;
  }

  const content = rewardsQuery.data?.items ? (
    <>
      <Hide below="lg" ssr={ false }>
        <AddressEpochRewardsTable
          items={ rewardsQuery.data.items }
          top={ rewardsQuery.pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
          isLoading={ rewardsQuery.isPlaceholderData }
        />
      </Hide>
      <Show below="lg" ssr={ false }>
        { rewardsQuery.data.items.map((item, index) => (
          <AddressEpochRewardsListItem
            key={ item.block_hash + item.type + item.account.hash + item.associated_account.hash + (rewardsQuery.isPlaceholderData ? String(index) : '') }
            item={ item }
            isLoading={ rewardsQuery.isPlaceholderData }
          />
        )) }
      </Show>
    </>
  ) : null;

  const actionBar = rewardsQuery.pagination.isVisible ? (
    <ActionBar mt={ -6 }>
      <AddressCsvExportLink
        address={ hash }
        isLoading={ rewardsQuery.pagination.isLoading }
        params={{ type: 'epoch-rewards' }}
        ml={{ lg: 'auto' }}
      />
      <Pagination ml={{ base: 0, lg: 8 }} { ...rewardsQuery.pagination }/>
    </ActionBar>
  ) : null;

  return (
    <DataListDisplay
      isError={ rewardsQuery.isError }
      items={ rewardsQuery.data?.items }
      emptyText="There are no epoch rewards for this address."
      content={ content }
      actionBar={ actionBar }
    />
  );
};

export default AddressEpochRewards;
