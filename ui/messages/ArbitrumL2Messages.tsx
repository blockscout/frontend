import { Hide, Show, Skeleton } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { rightLineArrow, nbsp } from 'lib/html-entities';
import { ARBITRUM_MESSAGES_ITEM } from 'stubs/arbitrumL2';
import { generateListStub } from 'stubs/utils';
import ArbitrumL2MessagesListItem from 'ui/messages/ArbitrumL2MessagesListItem';
import ArbitrumL2MessagesTable from 'ui/messages/ArbitrumL2MessagesTable';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import StickyPaginationWithText from 'ui/shared/StickyPaginationWithText';

export type MessagesDirection = 'from-rollup' | 'to-rollup';

type Props = {
  direction: MessagesDirection;
}

const ArbitrumL2Messages = ({ direction }: Props) => {
  const type = direction === 'from-rollup' ? 'withdrawals' : 'deposits';
  const { data, isError, isPlaceholderData, pagination } = useQueryWithPages({
    resourceName: 'arbitrum_l2_messages',
    pathParams: { direction },
    options: {
      placeholderData: generateListStub<'arbitrum_l2_messages'>(
        ARBITRUM_MESSAGES_ITEM,
        50,
        { next_page_params: { items_count: 50, direction: 'to-rollup', id: 123456 } },
      ),
    },
  });

  const countersQuery = useApiQuery('arbitrum_l2_messages_count', {
    pathParams: { direction },
    queryOptions: {
      placeholderData: 1927029,
    },
  });

  const content = data?.items ? (
    <>
      <Show below="lg" ssr={ false }>
        { data.items.map(((item, index) => (
          <ArbitrumL2MessagesListItem
            key={ String(item.id) + (isPlaceholderData ? index : '') }
            isLoading={ isPlaceholderData }
            item={ item }
            direction={ direction }
          />
        ))) }
      </Show>
      <Hide below="lg" ssr={ false }>
        <ArbitrumL2MessagesTable
          items={ data.items }
          direction={ direction }
          top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
          isLoading={ isPlaceholderData }
        />
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
        A total of { countersQuery.data?.toLocaleString() } { type } found
      </Skeleton>
    );
  })();

  const actionBar = <StickyPaginationWithText text={ text } pagination={ pagination }/>;

  return (
    <>
      <PageTitle
        title={ direction === 'from-rollup' ?
          `Withdrawals (L2${ nbsp }${ rightLineArrow }${ nbsp }L1)` :
          `Deposits (L1${ nbsp }${ rightLineArrow }${ nbsp }L2)` }
        withTextAd
      />
      <DataListDisplay
        isError={ isError }
        items={ data?.items }
        emptyText={ `There are no ${ type }.` }
        content={ content }
        actionBar={ actionBar }
      />
    </>
  );
};

export default ArbitrumL2Messages;
