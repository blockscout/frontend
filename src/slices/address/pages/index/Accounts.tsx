// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';
import PageTitle from 'src/shell/page/title/PageTitle';

import { TOP_ADDRESS } from 'src/slices/address/stubs/address';

import DataList from 'src/shared/lists/DataList';
import getItemIndex from 'src/shared/lists/get-item-index';
import Pagination from 'src/shared/pagination/Pagination';
import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import { generateListStub } from 'src/shared/pagination/utils';

import AddressesListItem from './AddressesListItem';
import AddressesTable from './AddressesTable';

const Accounts = () => {
  const { isError, isPlaceholderData, data, pagination } = useQueryWithPages({
    resourceName: 'core:addresses',
    options: {
      placeholderData: generateListStub<'core:addresses'>(
        TOP_ADDRESS,
        50,
        {
          next_page_params: {
            fetched_coin_balance: '42',
            hash: '0x99f0ec06548b086e46cb0019c78d0b9b9f36cd53',
            items_count: 50,
          },
          total_supply: '0',
          exchange_rate: '1',
        },
      ),
    },
  });

  const actionBar = pagination.isVisible && (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  );

  const pageStartIndex = getItemIndex(0, pagination.page);
  const totalSupply = React.useMemo(() => {
    return BigNumber(data?.total_supply || '0');
  }, [ data?.total_supply ]);

  const content = data?.items ? (
    <>
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
        { data.items.map((item, index) => {
          return (
            <AddressesListItem
              key={ item.hash + (isPlaceholderData ? index : '') }
              item={ item }
              index={ pageStartIndex + index }
              totalSupply={ totalSupply }
              isLoading={ isPlaceholderData }
            />
          );
        }) }
      </Box>
    </>
  ) : null;

  return (
    <>
      <PageTitle title="Top accounts" withTextAd/>
      <DataList
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText="There are no accounts."
        actionBar={ actionBar }
      >
        { content }
      </DataList>
    </>
  );
};

export default Accounts;
