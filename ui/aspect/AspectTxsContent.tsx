import { Hide, Show, Table, Tbody, Th, Tr } from '@chakra-ui/react';
import React from 'react';

import DataListDisplay from '../shared/DataListDisplay';
import type { QueryWithPagesResult } from '../shared/pagination/useQueryWithPages';
import TheadSticky from '../shared/TheadSticky';
import AspectTxItem from './AspectTxItem';
import AspectTxsList from './AspectTxsList';

interface IProps {
  txsQuery: QueryWithPagesResult<'aspect_transactions'>;
}

export default function AspectTxsContent({ txsQuery }: IProps) {
  const content = txsQuery.data ? (
    <>
      <Hide below="lg" ssr={ false }>
        <Table variant="simple" size="sm">
          <TheadSticky top={ 80 }>
            <Tr>
              <Th width="54px"></Th>
              <Th width="22%">Txn hash</Th>
              <Th width="160px">Type</Th>
              <Th width="18%">Block</Th>
              <Th width={{ xl: '160px', base: '90px' }}>From</Th>
              <Th width={{ xl: '36px', base: '28px' }}></Th>
              <Th width={{ xl: '160px', base: '90px' }}>To</Th>
              <Th width="20%" isNumeric>
                Value
              </Th>
              <Th width="20%" isNumeric pr={ 5 }>
                Fee
              </Th>
            </Tr>
          </TheadSticky>
          <Tbody>
            { txsQuery.data.items.map((data) => (
              <AspectTxItem data={ data } key={ data.block_number }/>
            )) }
          </Tbody>
        </Table>
      </Hide>
      <Show below="lg" ssr={ false }>
        <AspectTxsList data={ txsQuery.data.items }/>
      </Show>
    </>
  ) : null;

  return (
    <DataListDisplay
      isError={ false }
      items={ txsQuery.data?.items }
      emptyText="There are no properties."
      content={ content }
    />
  );
}
