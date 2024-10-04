import { Hide, Show } from '@chakra-ui/react';
import React from 'react';

import { MUD_WORLD } from 'stubs/mud';
import { generateListStub } from 'stubs/utils';
import MudWorldsListItem from 'ui/mudWorlds/MudWorldsListItem';
import MudWorldsTable from 'ui/mudWorlds/MudWorldsTable';
import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

const MudWorlds = () => {
  const { data, isError, isPlaceholderData, pagination } = useQueryWithPages({
    resourceName: 'mud_worlds',
    options: {
      placeholderData: generateListStub<'mud_worlds'>(
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
      <Show below="lg" ssr={ false }>
        { data.items.map(((item, index) => (
          <MudWorldsListItem
            key={ item.address.hash + (isPlaceholderData ? String(index) : '') }
            item={ item }
            isLoading={ isPlaceholderData }
          />
        ))) }
      </Show>
      <Hide below="lg" ssr={ false }>
        <MudWorldsTable items={ data.items } top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 } isLoading={ isPlaceholderData }/>
      </Hide>
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
      <DataListDisplay
        isError={ isError }
        items={ data?.items }
        emptyText="There are no MUD worlds."
        content={ content }
        actionBar={ actionBar }
      />
    </>
  );
};

export default MudWorlds;
