import { Table, Tbody, Tr, Th } from '@chakra-ui/react';
import React from 'react';

import type { AddressesItem } from 'types/api/addresses';

import { currencyUnits } from 'lib/units';
import { default as Thead } from 'ui/shared/TheadSticky';

import AddressesLabelSearchTableItem from './AddressesLabelSearchTableItem';

interface Props {
  items: Array<AddressesItem>;
  top: number;
  isLoading?: boolean;
}

const AddressesLabelSearchTable = ({ items, top, isLoading }: Props) => {
  return (
    <Table variant="simple" size="sm">
      <Thead top={ top }>
        <Tr>
          <Th width="70%">Address</Th>
          <Th width="15%" isNumeric>{ `Balance ${ currencyUnits.ether }` }</Th>
          <Th width="15%" isNumeric>Txn count</Th>
        </Tr>
      </Thead>
      <Tbody>
        { items.map((item, index) => (
          <AddressesLabelSearchTableItem
            key={ item.hash + (isLoading ? index : '') }
            item={ item }
            isLoading={ isLoading }
          />
        )) }
      </Tbody>
    </Table>
  );
};

export default AddressesLabelSearchTable;
