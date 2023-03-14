import { Hide, Show } from '@chakra-ui/react';
import React from 'react';

import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import AddressesListItem from 'ui/addresses/AddressesListItem';
import AddressesTable from 'ui/addresses/AddressesTable';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/Pagination';

const PAGE_SIZE = 50;

const Accounts = () => {
  const { isError, isLoading, data, isPaginationVisible, pagination } = useQueryWithPages({
    resourceName: 'addresses',
  });

  const actionBar = isPaginationVisible && (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  );

  const pageStartIndex = (pagination.page - 1) * PAGE_SIZE + 1;
  const content = data?.items ? (
    <>
      <Hide below="lg" ssr={ false }>
        <AddressesTable
          top={ isPaginationVisible ? 80 : 0 }
          items={ data.items }
          totalSupply={ data.total_supply }
          pageStartIndex={ pageStartIndex }
        />
      </Hide>
      <Show below="lg" ssr={ false }>
        { data.items.map((item, index) => {
          return (
            <AddressesListItem
              key={ item.hash }
              item={ item }
              index={ pageStartIndex + index }
              totalSupply={ data.total_supply }
            />
          );
        }) }
      </Show>
    </>
  ) : null;

  return (
    <Page>
      <PageTitle text="Top accounts" withTextAd/>
      <DataListDisplay
        isError={ isError }
        isLoading={ isLoading }
        items={ data?.items }
        skeletonProps={{ skeletonDesktopColumns: [ '64px', '30%', '20%', '20%', '15%', '15%' ] }}
        emptyText="There are no accounts."
        content={ content }
        actionBar={ actionBar }
      />
    </Page>
  );
};

export default Accounts;
