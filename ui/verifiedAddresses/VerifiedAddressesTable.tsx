import { Table, Tbody, Th, Thead, Tr } from '@chakra-ui/react';
import React from 'react';

import type { TokenInfoApplication, VerifiedAddress } from 'types/api/account';

import VerifiedAddressesTableItem from './VerifiedAddressesTableItem';

interface Props {
  data: Array<VerifiedAddress>;
  applications: Array<TokenInfoApplication> | undefined;
  onItemAdd: (address: string) => void;
  onItemEdit: (address: string) => void;
}

const VerifiedAddressesTable = ({ data, applications, onItemEdit, onItemAdd }: Props) => {
  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Address</Th>
          <Th w="232px">Token info</Th>
          <Th w="160px">Request status</Th>
          <Th w="150px">Date</Th>
        </Tr>
      </Thead>
      <Tbody>
        { data.map((item) => (
          <VerifiedAddressesTableItem
            key={ item.contractAddress }
            item={ item }
            application={ applications?.find(({ tokenAddress }) => tokenAddress === item.contractAddress) }
            onAdd={ onItemAdd }
            onEdit={ onItemEdit }
          />
        )) }
      </Tbody>
    </Table>
  );
};

export default React.memo(VerifiedAddressesTable);
