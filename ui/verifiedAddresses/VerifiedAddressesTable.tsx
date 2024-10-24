import { Table, Tbody, Th, Thead, Tr } from '@chakra-ui/react';
import React from 'react';

import type { TokenInfoApplication, VerifiedAddress } from 'types/api/account';

import VerifiedAddressesTableItem from './VerifiedAddressesTableItem';

interface Props {
  data: Array<VerifiedAddress>;
  applications: Array<TokenInfoApplication> | undefined;
  onItemAdd: (address: string) => void;
  onItemEdit: (address: string) => void;
  isLoading: boolean;
}

const VerifiedAddressesTable = ({ data, applications, onItemEdit, onItemAdd, isLoading }: Props) => {
  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Address</Th>
          <Th w="168px" pr={ 1 }>Token info</Th>
          <Th w="36px" pl="0"></Th>
          <Th w="160px">Request status</Th>
          <Th w="150px">Date</Th>
        </Tr>
      </Thead>
      <Tbody>
        { data.map((item, index) => (
          <VerifiedAddressesTableItem
            key={ item.contractAddress + (isLoading ? index : '') }
            item={ item }
            application={ applications?.find(({ tokenAddress }) => tokenAddress.toLowerCase() === item.contractAddress.toLowerCase()) }
            onAdd={ onItemAdd }
            onEdit={ onItemEdit }
            isLoading={ isLoading }
          />
        )) }
      </Tbody>
    </Table>
  );
};

export default React.memo(VerifiedAddressesTable);
