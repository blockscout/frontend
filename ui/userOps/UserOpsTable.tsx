import React from 'react';

import type { UserOpsItem } from 'types/api/userOps';

import config from 'configs/app';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import TimeFormatToggle from 'ui/shared/time/TimeFormatToggle';

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
    <TableRoot minW="1000px">
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader w="60%">User op hash</TableColumnHeader>
          <TableColumnHeader w="180px">
            Timestamp
            <TimeFormatToggle/>
          </TableColumnHeader>
          <TableColumnHeader w="140px">Status</TableColumnHeader>
          { showSender && <TableColumnHeader w="160px">Sender</TableColumnHeader> }
          { showTx && <TableColumnHeader w="160px">Tx hash</TableColumnHeader> }
          <TableColumnHeader w="40%">Block</TableColumnHeader>
          { !config.UI.views.tx.hiddenFields?.tx_fee && <TableColumnHeader w="120px" isNumeric>{ `Fee ${ config.chain.currency.symbol }` }</TableColumnHeader> }
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
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
      </TableBody>
    </TableRoot>
  );
};

export default UserOpsTable;
