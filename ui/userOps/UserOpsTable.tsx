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
   showTx: boolean;
   showSender: boolean;
 };

const UserOpsTable = ({ items, isLoading, top, showTx, showSender }: Props) => {
  return (
    <Table variant="simple" size="sm" minW="1000px">
      <Thead top={ top }>
        <Tr>
          <Th w="60%">User op hash</Th>
          <Th w="110px">Age</Th>
          <Th w="140px">Status</Th>
          { showSender && <Th w="160px">Sender</Th> }
          { showTx && <Th w="160px">Tx hash</Th> }
          <Th w="40%">Block</Th>
          { !config.UI.views.tx.hiddenFields?.tx_fee && <Th w="120px" isNumeric>{ `Fee ${ config.chain.currency.symbol }` }</Th> }
        </Tr>
      </Thead>
      <Tbody>
        { items.map((item, index) => {
          return (
            <UserOpsTableItem
              key={ item.hash + (isLoading ? String(index) : '') }
              item={ item }
              isLoading={ isLoading }
              showSender={ showSender }
              showTx={ showTx }
            />
          );
        }) }
      </Tbody>
    </Table>
  );
};

export default UserOpsTable;
