import { Table, Tbody, Tr, Th } from '@chakra-ui/react';
import React from 'react';

import type { TxBlob } from 'types/api/blobs';

import { default as Thead } from 'ui/shared/TheadSticky';

import TxBlobsTableItem from './TxBlobsTableItem';

interface Props {
  data: Array<TxBlob>;
  top: number;
  isLoading?: boolean;
}

const TxInternalsTable = ({ data, top, isLoading }: Props) => {

  return (
    <Table variant="simple" size="sm">
      <Thead top={ top }>
        <Tr>
          <Th width="60%">Blob hash</Th>
          <Th width="20%">Data type</Th>
          <Th width="20%">Size, bytes</Th>
        </Tr>
      </Thead>
      <Tbody>
        { data.map((item, index) => (
          <TxBlobsTableItem key={ item.hash + (isLoading ? index : '') } data={ item } isLoading={ isLoading }/>
        )) }
      </Tbody>
    </Table>
  );
};

export default TxInternalsTable;
