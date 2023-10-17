import { Hide, Show, Skeleton, Text } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { L2_OUTPUT_ROOTS_ITEM } from 'stubs/L2';
import { generateListStub } from 'stubs/utils';
import OutputRootsListItem from 'ui/l2OutputRoots/OutputRootsListItem';
import OutputRootsTable from 'ui/l2OutputRoots/OutputRootsTable';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import StickyPaginationWithText from 'ui/shared/StickyPaginationWithText';

const L2OutputRoots = () => {
  const { data, isError, isPlaceholderData, pagination } = useQueryWithPages({
    resourceName: 'l2_output_roots',
    options: {
      placeholderData: generateListStub<'l2_output_roots'>(
        L2_OUTPUT_ROOTS_ITEM,
        50,
        {
          next_page_params: {
            items_count: 50,
            index: 9045200,
          },
        },
      ),
    },
  });

  const countersQuery = useApiQuery('l2_output_roots_count', {
    queryOptions: {
      placeholderData: 50617,
    },
  });

  const content = data?.items ? (
    <>
      <Show below="lg" ssr={ false }>
        { data.items.map(((item, index) => (
          <OutputRootsListItem
            key={ item.l2_output_index + (isPlaceholderData ? String(index) : '') }
            item={ item }
            isLoading={ isPlaceholderData }
          />
        ))) }
      </Show>
      <Hide below="lg" ssr={ false }>
        <OutputRootsTable items={ data.items } top={ pagination.isVisible ? 80 : 0 } isLoading={ isPlaceholderData }/>
      </Hide>
    </>
  ) : null;

  const text = (() => {
    if (countersQuery.isError || isError || !data?.items.length) {
      return null;
    }

    return (
      <Skeleton isLoaded={ !countersQuery.isPlaceholderData && !isPlaceholderData } display="flex" flexWrap="wrap">
        L2 output index
        <Text fontWeight={ 600 } whiteSpace="pre"> #{ data.items[0].l2_output_index } </Text>to
        <Text fontWeight={ 600 } whiteSpace="pre"> #{ data.items[data.items.length - 1].l2_output_index } </Text>
        (total of { countersQuery.data?.toLocaleString() } roots)
      </Skeleton>
    );
  })();

  const actionBar = <StickyPaginationWithText text={ text } pagination={ pagination }/>;

  return (
    <>
      <PageTitle title="Output roots" withTextAd/>
      <DataListDisplay
        isError={ isError }
        items={ data?.items }
        emptyText="There are no output roots."
        content={ content }
        actionBar={ actionBar }
      />
    </>
  );
};

export default L2OutputRoots;
