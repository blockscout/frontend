// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { ClusterChainConfig } from 'client/features/multichain/types/client';
import type { UserOpsItem } from 'client/features/user-ops/types/api';

import AddressStringOrParam from 'client/slices/address/components/entity/AddressStringOrParam';
import BlockEntity from 'client/slices/block/components/entity/BlockEntity';
import TxEntity from 'client/slices/tx/components/entity/TxEntity';

import UserOpEntity from 'client/features/user-ops/components/entity/UserOpEntity';
import UserOpStatus from 'client/features/user-ops/components/UserOpStatus';

import config from 'client/config';
import TimeWithTooltip from 'client/shared/date-and-time/TimeWithTooltip';
import ChainIcon from 'client/shared/external-chains/ChainIcon';
import NativeCoinValue from 'client/shared/values/entity/NativeCoinValue';

import { TableCell, TableRow } from 'toolkit/chakra/table';

type Props = {
  item: UserOpsItem;
  isLoading?: boolean;
  showTx: boolean;
  showSender: boolean;
  chainData?: ClusterChainConfig;
};

const UserOpsTableItem = ({ item, isLoading, showTx, showSender, chainData }: Props) => {
  return (
    <TableRow>
      { chainData && (
        <TableCell verticalAlign="middle">
          <ChainIcon data={ chainData } isLoading={ isLoading }/>
        </TableCell>
      ) }
      <TableCell verticalAlign="middle">
        <UserOpEntity hash={ item.hash } isLoading={ isLoading } noIcon fontWeight={ 700 } truncation="constant_long" noCopy/>
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
      { !config.slices.tx.hiddenFields?.tx_fee && (
        <TableCell verticalAlign="middle" isNumeric>
          <NativeCoinValue amount={ item.fee } loading={ isLoading } noSymbol/>
        </TableCell>
      ) }
    </TableRow>
  );
};

export default UserOpsTableItem;
