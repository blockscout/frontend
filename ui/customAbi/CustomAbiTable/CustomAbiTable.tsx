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
  data?: CustomAbis;
  isLoading?: boolean;
  onEditClick: (item: CustomAbi) => void;
  onDeleteClick: (item: CustomAbi) => void;
}

const CustomAbiTable = ({ data, isLoading, onDeleteClick, onEditClick }: Props) => {
  return (
    <Table minWidth="600px">
      <Thead>
        <Tr>
          <Th>ABI for Smart contract address (0x...)</Th>
          <Th width="108px"></Th>
        </Tr>
      </Thead>
      <Tbody>
        { data?.map((item, index) => (
          <CustomAbiTableItem
            key={ item.id + (isLoading ? String(index) : '') }
            item={ item }
            isLoading={ isLoading }
            onDeleteClick={ onDeleteClick }
            onEditClick={ onEditClick }
          />
        )) }
      </Tbody>
    </Table>
  );
};

export default React.memo(CustomAbiTable);
