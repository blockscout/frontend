import { Hide, Show, Skeleton } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { rightLineArrow, nbsp } from 'lib/html-entities';
import { SCROLL_L2_MESSAGE_ITEM } from 'stubs/scrollL2';
import { generateListStub } from 'stubs/utils';
import ScrollL2DepositsListItem from 'ui/deposits/scrollL2/ScrollL2DepositsListItem';
import ScrollL2DepositsTable from 'ui/deposits/scrollL2/ScrollL2DepositsTable';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import StickyPaginationWithText from 'ui/shared/StickyPaginationWithText';

const ScrollL2Deposits = () => {
  const { data, isError, isPlaceholderData, pagination } = useQueryWithPages({
    resourceName: 'scroll_l2_deposits',
    options: {
      placeholderData: generateListStub<'scroll_l2_deposits'>(
        SCROLL_L2_MESSAGE_ITEM,
        50,
        { next_page_params: { items_count: 50, id: 1 } },
      ),
    },
  });

  const countersQuery = useApiQuery('scroll_l2_deposits_count', {
    queryOptions: {
      placeholderData: 1927029,
    },
  });

  const content = data?.items ? (
    <>
      <Show below="lg" ssr={ false }>
        { data.items.map(((item, index) => (
          <ScrollL2DepositsListItem
            key={ String(item.id) + (isPlaceholderData ? index : '') }
            isLoading={ isPlaceholderData }
            item={ item }
          />
        ))) }
      </Show>
      <Hide below="lg" ssr={ false }>
        <ScrollL2DepositsTable items={ data.items } top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 } isLoading={ isPlaceholderData }/>
      </Hide>
    </>
  ) : null;

  const text = (() => {
    if (countersQuery.isError) {
      return null;
    }

    return (
      <Skeleton
        isLoaded={ !countersQuery.isPlaceholderData }
        display="inline-block"
      >
        A total of { countersQuery.data?.toLocaleString() } deposits found
      </Skeleton>
    );
  })();

  const actionBar = <StickyPaginationWithText text={ text } pagination={ pagination }/>;

  return (
    <>
      <PageTitle title={ `Deposits (L1${ nbsp }${ rightLineArrow }${ nbsp }L2)` } withTextAd/>
      <DataListDisplay
        isError={ isError }
        items={ data?.items }
        emptyText="There are no deposits."
        content={ content }
        actionBar={ actionBar }
      />
    </>
  );
};

export default ScrollL2Deposits;
