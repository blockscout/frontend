import {
  Table,
  Tbody,
  Tr,
  Th,
} from '@chakra-ui/react';
import React from 'react';

import type { TxStateChange } from 'types/api/txStateChanges';

import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import { default as Thead } from 'ui/shared/TheadSticky';
import TxStateTableItem from 'ui/tx/state/TxStateTableItem';

interface Props {
  data: Array<TxStateChange>;
  isLoading?: boolean;
  top: number;
}

const TxStateTable = ({ data, isLoading, top }: Props) => {
  return (
    <AddressHighlightProvider>
      <Table minWidth="1000px" w="100%">
        <Thead top={ top }>
          <Tr>
            <Th width="140px">Type</Th>
            <Th width="160px">Address</Th>
            <Th width="33%" isNumeric>Before</Th>
            <Th width="33%" isNumeric>After</Th>
            <Th width="33%" isNumeric>Change</Th>
            <Th width="150px" minW="80px" maxW="150px">Token ID</Th>
          </Tr>
        </Thead>
        <Tbody>
          { data.map((item, index) => <TxStateTableItem data={ item } key={ index } isLoading={ isLoading }/>) }
        </Tbody>
      </Table>
    </AddressHighlightProvider>
  );
};

export default React.memo(TxStateTable);
