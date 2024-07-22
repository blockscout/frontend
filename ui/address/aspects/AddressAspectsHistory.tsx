import { Hide, Show, Table, Tbody, Th, Tr } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { AddressAspectResponse } from 'types/api/address';
import type { PaginationParams } from 'ui/shared/pagination/types';

import DataListDisplay from 'ui/shared/DataListDisplay';
import TheadSticky from 'ui/shared/TheadSticky';

import AddressAspectsItem from './AddressAspectsItem';
import AddressAspectsList from './AddressAspectsList';

interface Props {
  query: UseQueryResult<AddressAspectResponse> & {
    pagination: PaginationParams;
  };
}

const AddressAspectsHistory = ({ query }: Props) => {
  const content = query.data ? (
    <>
      <Hide below="lg" ssr={ false }>
        <Table variant="simple" size="sm">
          <TheadSticky top={ 80 }>
            <Tr>
              <Th width="25%">Aspect Id</Th>
              <Th width="35%">Join Points</Th>
              <Th width="20%">Version</Th>
              <Th width="20%" textAlign="end">Priority</Th>
            </Tr>
          </TheadSticky>
          <Tbody>
            { query.data.items.map((item, index) =>
              <AddressAspectsItem data={ item } key={ query.isPlaceholderData ? index : item.aspect_hash } isLoading={ query.isPlaceholderData }/>) }
          </Tbody>
        </Table>
      </Hide>
      <Show below="lg" ssr={ false }>
        <AddressAspectsList query={ query }/>
      </Show>
    </>
  ) : null;

  return (
    <DataListDisplay
      isError={ false }
      items={ query.data?.items }
      emptyText="There are no aspects."
      content={ content }
    />
  );
};

export default React.memo(AddressAspectsHistory);
