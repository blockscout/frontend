import {
  Table,
  Tbody,
  Tr,
  Th,
} from '@chakra-ui/react';
import React from 'react';

import type { TxStateChanges } from 'types/api/txStateChanges';

import { default as Thead } from 'ui/shared/TheadSticky';
import TxStateTableItem from 'ui/tx/state/TxStateTableItem';

interface Props {
  data: TxStateChanges;
}

const TxStateTable = ({ data }: Props) => {
  return (
    <Table variant="simple" minWidth="1000px" size="sm" w="auto" mt={ 6 }>
      <Thead top={ 0 }>
        <Tr>
          <Th width="140px"/>
          <Th width="146px">Address</Th>
          <Th width="33%" isNumeric>Before</Th>
          <Th width="33%" isNumeric>After</Th>
          <Th width="33%" isNumeric>Change</Th>
        </Tr>
      </Thead>
      <Tbody>
        { data.map((item, index) => <TxStateTableItem data={ item } key={ index }/>) }
      </Tbody>
    </Table>
  );
};

export default React.memo(TxStateTable);
