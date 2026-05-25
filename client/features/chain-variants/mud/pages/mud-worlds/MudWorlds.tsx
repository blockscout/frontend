// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import PageTitle from 'client/shell/page/title/PageTitle';

import { MUD_WORLD } from 'client/features/chain-variants/mud/stubs/mud-worlds';

import DataList from 'client/shared/lists/DataList';
import Pagination from 'client/shared/pagination/Pagination';
import useQueryWithPages from 'client/shared/pagination/useQueryWithPages';
import { generateListStub } from 'client/shared/pagination/utils';

import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';

import MudWorldsListItem from './MudWorldsListItem';
import MudWorldsTable from './MudWorldsTable';

const MudWorlds = () => {
  const { data, isError, isPlaceholderData, pagination } = useQueryWithPages({
    resourceName: 'general:mud_worlds',
    options: {
      placeholderData: generateListStub<'general:mud_worlds'>(
        MUD_WORLD,
        50,
        {
          next_page_params: {
            items_count: 50,
            world: '1',
          },
        },
      ),
    },
  });

  const content = data?.items ? (
    <>
      <Box hideFrom="lg">
        { data.items.map(((item, index) => (
          <MudWorldsListItem
            key={ item.address.hash + (isPlaceholderData ? String(index) : '') }
            item={ item }
            isLoading={ isPlaceholderData }
          />
        ))) }
      </Box>
      <Box hideBelow="lg">
        <MudWorldsTable items={ data.items } top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 } isLoading={ isPlaceholderData }/>
      </Box>
    </>
  ) : null;

  const actionBar = pagination.isVisible ? (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  ) : null;

  return (
    <>
      <PageTitle title="MUD worlds" withTextAd/>
      <DataList
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText="There are no MUD worlds."
        actionBar={ actionBar }
      >
        { content }
      </DataList>
    </>
  );
};

export default MudWorlds;
