import React from 'react';

import type { UserOpsItem } from 'types/api/userOps';

import config from 'configs/app';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import CurrencyValue from 'ui/shared/CurrencyValue';
import AddressStringOrParam from 'ui/shared/entities/address/AddressStringOrParam';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import UserOpEntity from 'ui/shared/entities/userOp/UserOpEntity';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import UserOpStatus from 'ui/shared/userOps/UserOpStatus';

 type Props = {
   item: UserOpsItem;
   isLoading?: boolean;
   showTx: boolean;
   showSender: boolean;
 };

const UserOpsTableItem = ({ item, isLoading, showTx, showSender }: Props) => {
  return (
    <TableRow>
      <TableCell verticalAlign="middle">
        <UserOpEntity hash={ item.hash } isLoading={ isLoading } noIcon fontWeight={ 700 } truncation="constant_long"/>
      </TableCell>
      <TableCell verticalAlign="middle">
        <TimeWithTooltip
          timestamp={ item.timestamp }
          isLoading={ isLoading }
          color="text.secondary"
          display="inline-block"
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <UserOpStatus status={ item.status } isLoading={ isLoading }/>
      </TableCell>
      { showSender && (
        <TableCell verticalAlign="middle">
          <AddressStringOrParam
            address={ item.address }
            isLoading={ isLoading }
            truncation="constant"
          />
        </TableCell>
      ) }
      { showTx && (
        <TableCell verticalAlign="middle">
          <TxEntity
            hash={ item.transaction_hash }
            isLoading={ isLoading }
            truncation="constant"
            noIcon
          />
        </TableCell>
      ) }
      <TableCell verticalAlign="middle">
        <BlockEntity
          number={ Number(item.block_number) }
          isLoading={ isLoading }
          textStyle="sm"
          noIcon
        />
      </TableCell>
      { !config.UI.views.tx.hiddenFields?.tx_fee && (
        <TableCell verticalAlign="middle" isNumeric>
          <CurrencyValue value={ item.fee } isLoading={ isLoading } accuracy={ 8 }/>
        </TableCell>
      ) }
    </TableRow>
  );
};

export default UserOpsTableItem;
