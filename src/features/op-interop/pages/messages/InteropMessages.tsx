// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';

import { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';
import PageTitle from 'src/shell/page/title/PageTitle';

import { INTEROP_MESSAGE } from 'src/features/op-interop/stubs';

import DataList from 'src/shared/lists/DataList';
import StickyPaginationWithText from 'src/shared/pagination/StickyPaginationWithText';
import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import { generateListStub } from 'src/shared/pagination/utils';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

import InteropMessagesListItem from './InteropMessagesListItem';
import InteropMessagesTable from './InteropMessagesTable';

const InteropMessages = () => {
  const interopMessagesQuery = useQueryWithPages({
    resourceName: 'core:optimistic_l2_interop_messages',
    options: {
      placeholderData: generateListStub<'core:optimistic_l2_interop_messages'>(INTEROP_MESSAGE, 50, { next_page_params: {
        init_transaction_hash: '',
        items_count: 50,
        timestamp: 0,
      } }),
    },
  });

  const countQuery = useApiQuery('core:optimistic_l2_interop_messages_count', {
    queryOptions: {
      placeholderData: 1927029,
    },
  });

  const text = (() => {
    if (countQuery.isError) {
      return null;
    }

    return (
      <Skeleton loading={ countQuery.isPlaceholderData }>
        A total of { countQuery.data?.toLocaleString() } messages found
      </Skeleton>
    );
  })();

  const actionBar = <StickyPaginationWithText text={ text } pagination={ interopMessagesQuery.pagination }/>;

  const content = (
    <>
      <Box hideFrom="lg">
        { interopMessagesQuery.data?.items.map((item, index) => (
          <InteropMessagesListItem
            key={ item.init_transaction_hash + (interopMessagesQuery.isPlaceholderData ? index : '') }
            item={ item }
            isLoading={ interopMessagesQuery.isPlaceholderData }
          />
        )) }
      </Box>
      <Box hideBelow="lg">
        <InteropMessagesTable
          items={ interopMessagesQuery.data?.items }
          top={ interopMessagesQuery.pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
          isLoading={ interopMessagesQuery.isPlaceholderData }
        />
      </Box>
    </>
  );

  return (
    <>
      <PageTitle
        title="Interop messages"
        withTextAd
      />
      <DataList
        isError={ interopMessagesQuery.isError }
        itemsNum={ interopMessagesQuery.data?.items.length }
        emptyText="There are no interop messages."
        actionBar={ actionBar }
      >
        { content }
      </DataList>
    </>
  );
};

export default InteropMessages;
