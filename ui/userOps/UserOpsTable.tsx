import { Table, Tbody, Th, Tr } from '@chakra-ui/react';
import React from 'react';

import type { UserOpsItem } from 'types/api/userOps';

import config from 'configs/app';
import { default as Thead } from 'ui/shared/TheadSticky';

import UserOpsTableItem from './UserOpsTableItem';

 type Props = {
   items: Array<UserOpsItem>;
   isLoading?: boolean;
   top: number;
 };

const UserOpsTable = ({ items, isLoading, top }: Props) => {
  return (
    <Table variant="simple" size="sm">
      <Thead top={ top }>
        <Tr>
          <Th w="60%">User op hash</Th>
          <Th w="110px">Age</Th>
          <Th w="140px">Status</Th>
          <Th w="160px">Sender</Th>
          <Th w="160px">Tx hash</Th>
          <Th w="40%">Block</Th>
          { /* add condition like in tx table */ }
          <Th w="120px" isNumeric>{ `Fee ${ config.chain.currency.symbol }` }</Th>
        </Tr>
      </Thead>
      <Tbody>
        { items.map((item, index) => (
          <UserOpsTableItem key={ (isLoading ? String(index) : '') } item={ item } isLoading={ isLoading }/>
        )) }
      </Tbody>
    </Table>
  );
};

export default UserOpsTable;
