import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
} from '@chakra-ui/react';
import React from 'react';

import type { CustomAbis, CustomAbi } from 'types/api/account';

import CustomAbiTableItem from './CustomAbiTableItem';

interface Props {
  data: CustomAbis;
  onEditClick: (item: CustomAbi) => void;
  onDeleteClick: (item: CustomAbi) => void;
}

const CustomAbiTable = ({ data, onDeleteClick, onEditClick }: Props) => {
  return (
    <Table variant="simple" minWidth="600px">
      <Thead>
        <Tr>
          <Th>ABI for Smart contract address (0x...)</Th>
          <Th width="108px"></Th>
        </Tr>
      </Thead>
      <Tbody>
        { data.map((item) => (
          <CustomAbiTableItem
            item={ item }
            key={ item.id }
            onDeleteClick={ onDeleteClick }
            onEditClick={ onEditClick }
          />
        )) }
      </Tbody>
    </Table>
  );
};

export default React.memo(CustomAbiTable);
