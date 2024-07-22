import { Hide, Show, Table, Tbody, Th, Tr } from '@chakra-ui/react';
import React from 'react';

import DataListDisplay from '../shared/DataListDisplay';
import type { QueryWithPagesResult } from '../shared/pagination/useQueryWithPages';
import TheadSticky from '../shared/TheadSticky';
import BindingsList from './BindingsList';
import BindingsTableItem from './BindingsTableItem';

interface IProps {
  bindingsQuery: QueryWithPagesResult<'bound_addresses'>;
}

export default function BindingsContent({ bindingsQuery }: IProps) {
  const content = bindingsQuery.data?.items.length ? (
    <>
      <Hide below="lg" ssr={ false }>
        <Table variant="simple" size="sm">
          <TheadSticky top={ 80 }>
            <Tr>
              <Th width="25%">Tx hash</Th>
              <Th width="25%">Type</Th>
              <Th width="25%">Version</Th>
              <Th width="25%">Address</Th>
            </Tr>
          </TheadSticky>
          <Tbody>
            { bindingsQuery.data.items.map((item, index) => (
              <BindingsTableItem
                data={ item }
                key={ bindingsQuery.isPlaceholderData ? index : item.bind_block_number }
                isLoading={ bindingsQuery.isPlaceholderData }
              />
            )) }
          </Tbody>
        </Table>
      </Hide>
      <Show below="lg" ssr={ false }>
        <BindingsList
          data={ bindingsQuery.data.items }
          isLoading={ bindingsQuery.isPlaceholderData }
          isPlaceholderData={ bindingsQuery.isPlaceholderData }
        />
      </Show>
    </>
  ) : null;

  return (
    <DataListDisplay
      isError={ false }
      items={ bindingsQuery.data?.items }
      emptyText="There are no bindings."
      content={ content }
    />
  );
}
