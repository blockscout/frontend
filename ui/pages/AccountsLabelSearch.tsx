import { Hide, Show } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import getQueryParamString from 'lib/router/getQueryParamString';
import { TOP_ADDRESS } from 'stubs/address';
import { generateListStub } from 'stubs/utils';
import AddressesLabelSearchListItem from 'ui/addressesLabelSearch/AddressesLabelSearchListItem';
import AddressesLabelSearchTable from 'ui/addressesLabelSearch/AddressesLabelSearchTable';
import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

const AccountsLabelSearch = () => {

  const router = useRouter();
  const slug = getQueryParamString(router.query.slug);
  const tagType = getQueryParamString(router.query.tagType);

  const { isError, isPlaceholderData, data, pagination } = useQueryWithPages({
    resourceName: 'addresses_metadata_search',
    filters: {
      slug,
      tag_type: tagType,
    },
    options: {
      placeholderData: generateListStub<'addresses_metadata_search'>(
        TOP_ADDRESS,
        5,
        {
          next_page_params: null,
        },
      ),
    },
  });

  const actionBar = pagination.isVisible && (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  );

  const content = data?.items ? (
    <>
      <Hide below="lg" ssr={ false }>
        <AddressesLabelSearchTable
          top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
          items={ data.items }
          isLoading={ isPlaceholderData }
        />
      </Hide>
      <Show below="lg" ssr={ false }>
        { data.items.map((item, index) => {
          return (
            <AddressesLabelSearchListItem
              key={ item.hash + (isPlaceholderData ? index : '') }
              item={ item }
              isLoading={ isPlaceholderData }
            />
          );
        }) }
      </Show>
    </>
  ) : null;

  return (
    <>
      <PageTitle title="Search result" withTextAd/>
      <DataListDisplay
        isError={ isError }
        items={ data?.items }
        emptyText={ null }
        content={ content }
        actionBar={ actionBar }
      />
    </>
  );
};

export default AccountsLabelSearch;
