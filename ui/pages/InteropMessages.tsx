import { Show, Hide } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { INTEROP_MESSAGE } from 'stubs/interop';
import { generateListStub } from 'stubs/utils';
import InteropMessagesListItem from 'ui/interopMessages/InteropMessagesListItem';
import InteropMessagesTable from 'ui/interopMessages/InteropMessagesTable';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import Skeleton from 'ui/shared/chakra/Skeleton';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import StickyPaginationWithText from 'ui/shared/StickyPaginationWithText';

const InteropMessages = () => {
  const interopMessagesQuery = useQueryWithPages({
    resourceName: 'optimistic_l2_interop_messages',
    options: {
      placeholderData: generateListStub<'optimistic_l2_interop_messages'>(INTEROP_MESSAGE, 50, { next_page_params: {
        init_transaction_hash: '',
        items_count: 50,
        timestamp: 0,
      } }),
    },
  });

  const countQuery = useApiQuery('optimistic_l2_interop_messages_count', {
    queryOptions: {
      placeholderData: 1927029,
    },
  });

  const text = (() => {
    if (countQuery.isError) {
      return null;
    }

    return (
      <Skeleton
        isLoaded={ !countQuery.isPlaceholderData }
        display="inline-block"
      >
        A total of { countQuery.data?.toLocaleString() } messages found
      </Skeleton>
    );
  })();

  const actionBar = <StickyPaginationWithText text={ text } pagination={ interopMessagesQuery.pagination }/>;

  const content = (
    <>
      <Show below="lg" ssr={ false }>
        { interopMessagesQuery.data?.items.map((item, index) => (
          <InteropMessagesListItem
            key={ item.init_transaction_hash + (interopMessagesQuery.isPlaceholderData ? index : '') }
            item={ item }
            isLoading={ interopMessagesQuery.isPlaceholderData }
          />
        )) }
      </Show>
      <Hide below="lg" ssr={ false }>
        <InteropMessagesTable
          items={ interopMessagesQuery.data?.items }
          top={ interopMessagesQuery.pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
          isLoading={ interopMessagesQuery.isPlaceholderData }
        />
      </Hide>
    </>
  );

  return (
    <>
      <PageTitle
        title="Interop messages"
        withTextAd
      />
      <DataListDisplay
        isError={ interopMessagesQuery.isError }
        items={ interopMessagesQuery.data?.items }
        emptyText="There are no interop messages."
        content={ content }
        actionBar={ actionBar }
      />
    </>
  );
};

export default InteropMessages;
