// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import { BigNumber } from 'bignumber.js';
import React from 'react';

import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';
import PageTitle from 'src/shell/page/title/PageTitle';

import AddressesListItem from 'src/slices/address/pages/index/AddressesListItem';
import AddressesTable from 'src/slices/address/pages/index/AddressesTable';
import { TOP_ADDRESS } from 'src/slices/address/stubs/address';

import ChainSelect from 'src/features/multichain/components/ChainSelect';
import { MultichainProvider } from 'src/features/multichain/context';

import DataList from 'src/shared/lists/DataList';
import getItemIndex from 'src/shared/lists/get-item-index';
import Pagination from 'src/shared/pagination/Pagination';
import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import { generateListStub } from 'src/shared/pagination/utils';

const MultichainAccounts = () => {
  const { isError, isPlaceholderData, data, pagination, chainValue, onChainValueChange } = useQueryWithPages({
    resourceName: 'general:addresses',
    options: {
      placeholderData: generateListStub<'general:addresses'>(TOP_ADDRESS, 50, {
        next_page_params: {
          fetched_coin_balance: '42',
          hash: '0x99f0ec06548b086e46cb0019c78d0b9b9f36cd53',
          items_count: 50,
        },
        total_supply: '0',
      }),
    },
    isMultichain: true,
  });

  const pageStartIndex = getItemIndex(0, pagination.page);
  const totalSupply = React.useMemo(() => {
    return BigNumber(data?.total_supply || '0');
  }, [ data?.total_supply ]);

  const content = data?.items ? (
    <MultichainProvider chainId={ chainValue?.[0] }>
      <Box hideBelow="lg">
        <AddressesTable
          top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
          items={ data.items }
          totalSupply={ totalSupply }
          pageStartIndex={ pageStartIndex }
          isLoading={ isPlaceholderData }
        />
      </Box>
      <Box hideFrom="lg">
        { data.items.map((item, index) => (
          <AddressesListItem
            key={ item.hash + (isPlaceholderData ? index : '') }
            item={ item }
            index={ pageStartIndex + index }
            totalSupply={ totalSupply }
            isLoading={ isPlaceholderData }
          />
        )) }
      </Box>
    </MultichainProvider>
  ) : null;

  const actionBar = (
    <ActionBar mt={ -6 }>
      <ChainSelect
        value={ chainValue }
        onValueChange={ onChainValueChange }
      />
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  );

  return (
    <>
      <PageTitle
        title="Top accounts"
        withTextAd
      />
      <DataList
        isError={ isError }
        itemsNum={ data?.items?.length }
        emptyText="There are no accounts."
        actionBar={ actionBar }
        showActionBarIfError
        showActionBarIfEmpty
      >
        { content }
      </DataList>
    </>
  );
};

export default React.memo(MultichainAccounts);
