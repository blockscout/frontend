import { Hide, Show } from '@chakra-ui/react';
import React from 'react';

import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import AddressesListItem from 'ui/addresses/AddressesListItem';
import AddressesTable from 'ui/addresses/AddressesTable';
import ActionBar from 'ui/shared/ActionBar';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/Pagination';
import SkeletonList from 'ui/shared/skeletons/SkeletonList';
import SkeletonTable from 'ui/shared/skeletons/SkeletonTable';

const PAGE_SIZE = 50;

const Accounts = () => {
  const { isError, isLoading, data, isPaginationVisible, pagination } = useQueryWithPages({
    resourceName: 'addresses',
  });

  const content = (() => {
    if (isError) {
      return <DataFetchAlert/>;
    }

    const bar = isPaginationVisible && (
      <ActionBar mt={ -6 }>
        <Pagination ml="auto" { ...pagination }/>
      </ActionBar>
    );

    if (isLoading) {
      return (
        <>
          { bar }
          <Show below="lg">
            <SkeletonList/>
          </Show>
          <Hide below="lg">
            <SkeletonTable columns={ [ '64px', '30%', '20%', '20%', '15%', '15%' ] }/>
          </Hide>
        </>
      );
    }

    const pageStartIndex = (pagination.page - 1) * PAGE_SIZE + 1;

    return (
      <>
        { bar }
        <Hide below="lg" ssr={ false }>
          <AddressesTable
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
    );
  })();

  return (
    <Page>
      <PageTitle text="Top accounts" withTextAd/>
      { content }
    </Page>
  );
};

export default Accounts;
