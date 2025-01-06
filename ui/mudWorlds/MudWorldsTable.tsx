import { Table, Tbody, Th, Tr } from '@chakra-ui/react';
import React from 'react';

import type { MudWorldItem } from 'types/api/mudWorlds';

import { currencyUnits } from 'lib/units';
import { default as Thead } from 'ui/shared/TheadSticky';

import MudWorldsTableItem from './MudWorldsTableItem';

type Props = {
  items: Array<MudWorldItem>;
  top: number;
  isLoading?: boolean;
};

const MudWorldsTable = ({ items, top, isLoading }: Props) => {
  return (
    <Table style={{ tableLayout: 'auto' }}>
      <Thead top={ top }>
        <Tr>
          <Th>Address</Th>
          <Th isNumeric>{ `Balance ${ currencyUnits.ether }` }</Th>
          <Th isNumeric>Txn count</Th>
        </Tr>
      </Thead>
      <Tbody>
        { items.map((item, index) => (
          <MudWorldsTableItem
            key={ String(item.address.hash) + (isLoading ? index : '') }
            item={ item }
            isLoading={ isLoading }
          />
        )) }
      </Tbody>
    </Table>
  );
};

export default MudWorldsTable;
