// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import BeaconChainWithdrawalsListItem from 'client/features/chain-variants/beacon-chain/pages/withdrawals/BeaconChainWithdrawalsListItem';
import BeaconChainWithdrawalsTable from 'client/features/chain-variants/beacon-chain/pages/withdrawals/BeaconChainWithdrawalsTable';
import { WITHDRAWAL } from 'client/features/chain-variants/beacon-chain/stubs/withdrawals';

import useIsMounted from 'client/shared/hooks/useIsMounted';
import DataList from 'client/shared/lists/DataList';
import Pagination from 'client/shared/pagination/Pagination';
import useQueryWithPages from 'client/shared/pagination/useQueryWithPages';
import { generateListStub } from 'client/shared/pagination/utils';
import getQueryParamString from 'client/shared/router/get-query-param-string';

import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';

type Props = {
  shouldRender?: boolean;
  isQueryEnabled?: boolean;
};
const AddressWithdrawals = ({ shouldRender = true, isQueryEnabled = true }: Props) => {
  const router = useRouter();
  const isMounted = useIsMounted();

  const hash = getQueryParamString(router.query.hash);

  const { data, isPlaceholderData, isError, pagination } = useQueryWithPages({
    resourceName: 'general:address_withdrawals',
    pathParams: { hash },
    options: {
      enabled: isQueryEnabled,
      placeholderData: generateListStub<'general:address_withdrawals'>(WITHDRAWAL, 50, { next_page_params: {
        index: 5,
        items_count: 50,
      } }),
    },
  });

  if (!isMounted || !shouldRender) {
    return null;
  }

  const content = data?.items ? (
    <>
      <Box hideFrom="lg">
        { data.items.map((item, index) => (
          <BeaconChainWithdrawalsListItem
            key={ item.index + Number(isPlaceholderData ? index : '') }
            item={ item }
            view="address"
            isLoading={ isPlaceholderData }
          />
        )) }
      </Box>
      <Box hideBelow="lg">
        <BeaconChainWithdrawalsTable
          items={ data.items }
          view="address"
          top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
          isLoading={ isPlaceholderData }
        />
      </Box>
    </>
  ) : null ;

  const actionBar = pagination.isVisible ? (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  ) : null;

  return (
    <DataList
      isError={ isError }
      itemsNum={ data?.items?.length }
      emptyText="There are no withdrawals for this address."
      actionBar={ actionBar }
    >
      { content }
    </DataList>
  );
};

export default AddressWithdrawals;
