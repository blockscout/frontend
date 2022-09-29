import { Table, Thead, Tbody, Tr, Th, TableContainer } from '@chakra-ui/react';
import React from 'react';

import type { data as txData } from 'data/txInternal';
import useNetwork from 'lib/hooks/useNetwork';
import TxInternalsTableItem from 'ui/tx/internals/TxInternalsTableItem';

const TxInternalsTable = ({ data }: { data: typeof txData}) => {
  const selectedNetwork = useNetwork();

  return (
    <TableContainer width="100%" mt={ 6 }>
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th width="28%">Type</Th>
            <Th width="20%">From</Th>
            <Th width="24px" px={ 0 }/>
            <Th width="20%">To</Th>
            <Th width="16%" isNumeric>Value { selectedNetwork?.currency }</Th>
            <Th width="16%" isNumeric>Gas limit</Th>
          </Tr>
        </Thead>
        <Tbody>
          { data.map((item) => (
            <TxInternalsTableItem key={ item.id } { ...item }/>
          )) }
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default TxInternalsTable;
