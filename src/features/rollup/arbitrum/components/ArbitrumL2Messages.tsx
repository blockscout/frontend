// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';

import { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';
import PageTitle from 'src/shell/page/title/PageTitle';

import { layerLabels } from 'src/features/rollup/common/utils/layer';

import DataList from 'src/shared/lists/DataList';
import StickyPaginationWithText from 'src/shared/pagination/StickyPaginationWithText';
import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import { generateListStub } from 'src/shared/pagination/utils';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { rightLineArrow, nbsp } from 'src/toolkit/utils/htmlEntities';

import { ARBITRUM_MESSAGES_ITEM } from '../stubs';
import ArbitrumL2MessagesListItem from './ArbitrumL2MessagesListItem';
import ArbitrumL2MessagesTable from './ArbitrumL2MessagesTable';

export type MessagesDirection = 'from-rollup' | 'to-rollup';

interface Props {
  direction: MessagesDirection;
};

const ArbitrumL2Messages = ({ direction }: Props) => {
  const type = direction === 'from-rollup' ? 'withdrawals' : 'deposits';
  const { data, isError, isPlaceholderData, pagination } = useQueryWithPages({
    resourceName: 'core:arbitrum_l2_messages',
    pathParams: { direction },
    options: {
      placeholderData: generateListStub<'core:arbitrum_l2_messages'>(
        ARBITRUM_MESSAGES_ITEM,
        50,
        { next_page_params: { items_count: 50, direction: 'to-rollup', id: 123456 } },
      ),
    },
  });

  const countersQuery = useApiQuery('core:arbitrum_l2_messages_count', {
    pathParams: { direction },
    queryOptions: {
      placeholderData: 1927029,
    },
  });

  const content = data?.items ? (
    <>
      <Box hideFrom="lg">
        { data.items.map(((item, index) => (
          <ArbitrumL2MessagesListItem
            key={ String(item.id) + (isPlaceholderData ? index : '') }
            isLoading={ isPlaceholderData }
            item={ item }
            direction={ direction }
          />
        ))) }
      </Box>
      <Box hideBelow="lg">
        <ArbitrumL2MessagesTable
          items={ data.items }
          direction={ direction }
          top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
          isLoading={ isPlaceholderData }
        />
      </Box>
    </>
  ) : null;

  const text = (() => {
    if (countersQuery.isError) {
      return null;
    }

    return (
      <Skeleton
        loading={ countersQuery.isPlaceholderData }
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
          `Withdrawals (${ layerLabels.current }${ nbsp }${ rightLineArrow }${ nbsp }${ layerLabels.parent })` :
          `Deposits (${ layerLabels.parent }${ nbsp }${ rightLineArrow }${ nbsp }${ layerLabels.current })` }
        withTextAd
      />
      <DataList
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText={ `There are no ${ type }.` }
        actionBar={ actionBar }
      >
        { content }
      </DataList>
    </>
  );
};

export default ArbitrumL2Messages;
