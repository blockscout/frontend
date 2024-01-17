import { Td, Tr, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { UserOpsItem } from 'types/api/userOps';

import config from 'configs/app';
import dayjs from 'lib/date/dayjs';
import CurrencyValue from 'ui/shared/CurrencyValue';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import UserOpEntity from 'ui/shared/entities/userOp/UserOpEntity';
import UserOpsAddress from 'ui/shared/userOps/UserOpsAddress';
import UserOpStatus from 'ui/shared/userOps/UserOpStatus';

 type Props = {
   item: UserOpsItem;
   isLoading?: boolean;
 };

const WithdrawalsTableItem = ({ item, isLoading }: Props) => {
  // will be fixed on the back-end
  const timeAgo = dayjs(Number(item.timestamp) * 1000).fromNow();

  return (
    <Tr>
      <Td verticalAlign="middle">
        <UserOpEntity hash={ item.hash } isLoading={ isLoading } noIcon fontWeight={ 700 }/>
      </Td>
      <Td verticalAlign="middle">
        <Skeleton isLoaded={ !isLoading } color="text_secondary" display="inline-block"><span>{ timeAgo }</span></Skeleton>
      </Td>
      <Td verticalAlign="middle">
        <UserOpStatus status={ item.status } isLoading={ isLoading }/>
      </Td>
      <Td verticalAlign="middle">
        <UserOpsAddress
          address={ item.address }
          isLoading={ isLoading }
          truncation="constant"
        />
      </Td>
      <Td verticalAlign="middle">
        <TxEntity
          hash={ item.transaction_hash }
          isLoading={ isLoading }
          truncation="constant"
          noIcon
        />
      </Td>
      <Td verticalAlign="middle">
        <BlockEntity
          number={ item.block_number }
          isLoading={ isLoading }
          fontSize="sm"
          lineHeight={ 5 }
          noIcon
        />
      </Td>
      { !config.UI.views.tx.hiddenFields?.tx_fee && (
        <Td verticalAlign="middle" isNumeric>
          <CurrencyValue value={ item.fee } isLoading={ isLoading } accuracy={ 8 }/>
        </Td>
      ) }
    </Tr>
  );
};

export default WithdrawalsTableItem;
