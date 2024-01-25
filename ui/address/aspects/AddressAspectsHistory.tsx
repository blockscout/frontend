import { Hide, Table, Tbody, Th, Tr } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { AddressAspectsHistoryResponse } from 'types/api/address';
import type { PaginationParams } from 'ui/shared/pagination/types';

import type { AspectType } from 'ui/address/AddressAspects';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/pagination/Pagination';
import { default as Thead } from 'ui/shared/TheadSticky';

import AddressAspectsTableItem from './AddressAspectsTableItem';

interface Props {
  query: UseQueryResult<AddressAspectsHistoryResponse> & {
    pagination: PaginationParams;
  };
  aspectList: Array<Array<AspectType>>;
}

const AddressAspectsHistory = ({ query, aspectList }: Props) => {
  const [ page, setPage ] = React.useState<number>(1);
  const onNextPageClick =
    React.useCallback(() => {
      () => {
        setPage(page => page + 1);
      };
    }, [ setPage ]);

  const onPrevPageClick =
    React.useCallback(() => {
      () => {
        setPage(page => page - 1);
      };
    }, [ setPage ]);

  const resetPage =
    React.useCallback(() => {
      () => {
        setPage(1);
      };
    }, [ setPage ]);

  const content = query.data?.items ? (
    <Hide below="lg" ssr={ false }>
      <Table variant="simple" size="sm">
        <Thead top={ query.pagination.isVisible ? 80 : 0 }>
          <Tr>
            <Th width="40%">Aspect ID</Th>
            <Th width="20%">Join Points</Th>
            <Th width="20%">Version</Th>
            <Th width="20%">Priority</Th>
          </Tr>
        </Thead>
        <Tbody>
          { aspectList[0] ?
            aspectList[page - 1].map((item: AspectType, index: number) => (
              <AddressAspectsTableItem
                key={ index }
                { ...item }
                page={ query.pagination.page }
                isLoading={ query.isPlaceholderData }
              />
            )) : '' }
        </Tbody>
      </Table>
    </Hide>
  ) : null;

  const actionBar = (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" page={ page } isVisible={ true } hasPages={ aspectList.length > 0 }
        hasNextPage={ page < aspectList.length } canGoBackwards={ true } isLoading={ false }
        onNextPageClick={ onNextPageClick } onPrevPageClick={ onPrevPageClick } resetPage={ resetPage }/>
    </ActionBar>
  );

  return (
    <DataListDisplay
      mt={ 8 }
      isError={ query.isError }
      items={ aspectList }
      emptyText="There is no aspect bound to this address."
      content={ content }
      actionBar={ actionBar }
    />
  );
};

export default React.memo(AddressAspectsHistory);
