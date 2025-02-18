import { Table, Tbody, Tr, Th } from '@chakra-ui/react';
import React from 'react';

import type { TxAuthorization } from 'types/api/transaction';

import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import { default as Thead } from 'ui/shared/TheadSticky';

import TxAuthorizationsTableItem from './TxAuthorizationsTableItem';

interface Props {
  data: Array<TxAuthorization> | undefined;
  isLoading?: boolean;
}

const TxAuthorizationsTable = ({ data, isLoading }: Props) => {
  return (
    <AddressHighlightProvider>
      <Table>
        <Thead>
          <Tr>
            <Th width="50%">Address</Th>
            <Th width="50%">Authority</Th>
            <Th width="120px">Chain</Th>
            <Th width="120px" isNumeric>Nonce</Th>
          </Tr>
        </Thead>
        <Tbody>
          { data?.map((item, index) => (
            <TxAuthorizationsTableItem key={ item.nonce.toString() + (isLoading ? index : '') } { ...item } isLoading={ isLoading }/>
          )) }
        </Tbody>
      </Table>
    </AddressHighlightProvider>
  );
};

export default TxAuthorizationsTable;
