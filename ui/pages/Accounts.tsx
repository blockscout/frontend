import { Hide, Show } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import { TOP_ADDRESS } from 'stubs/address';
import { generateListStub } from 'stubs/utils';
import AddressesListItem from 'ui/addresses/AddressesListItem';
import AddressesTable from 'ui/addresses/AddressesTable';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

const PAGE_SIZE = 50;

const Accounts = () => {
  const { isError, isPlaceholderData, data, pagination } = useQueryWithPages({
    resourceName: 'addresses',
    options: {
      placeholderData: generateListStub<'addresses'>(
        TOP_ADDRESS,
        50,
        {
          next_page_params: {
            fetched_coin_balance: '42',
            hash: '0x99f0ec06548b086e46cb0019c78d0b9b9f36cd53',
            items_count: 50,
          },
          total_supply: '0',
        },
      ),
    },
  });

  const actionBar = pagination.isVisible && (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  );

  const pageStartIndex = (pagination.page - 1) * PAGE_SIZE + 1;
  const totalSupply = React.useMemo(() => {
    return BigNumber(data?.total_supply || '0');
  }, [ data?.total_supply ]);

  const content = data?.items ? (
    <>
      <Hide below="lg" ssr={ false }>
        <AddressesTable
          top={ pagination.isVisible ? 80 : 0 }
          items={ data.items }
          totalSupply={ totalSupply }
          pageStartIndex={ pageStartIndex }
          isLoading={ isPlaceholderData }
        />
      </Hide>
      <Show below="lg" ssr={ false }>
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
      </Show>
    </>
  ) : null;

  return (
    <>
      <PageTitle title="Top accounts" withTextAd/>
      <DataListDisplay
        isError={ isError }
        items={ data?.items }
        emptyText="There are no accounts."
        content={ content }
        actionBar={ actionBar }
      />
    </>
  );
};

export default Accounts;
