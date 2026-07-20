// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';
import type { ClusterChainConfig } from 'src/features/multichain/types/client';

import AddressStringOrParam from 'src/slices/address/components/entity/AddressStringOrParam';
import BlockEntity from 'src/slices/block/components/entity/BlockEntity';
import TxEntity from 'src/slices/tx/components/entity/TxEntity';

import UserOpEntity from 'src/features/user-ops/components/entity/UserOpEntity';
import UserOpStatus from 'src/features/user-ops/components/UserOpStatus';

import config from 'src/config';
import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';
import ChainIcon from 'src/shared/external-chains/ChainIcon';
import NativeCoinValue from 'src/shared/values/entity/NativeCoinValue';

import { TableCell, TableRow } from 'src/toolkit/chakra/table';

type Props = {
  item: schemas['UserOperationInList'];
  isLoading?: boolean;
  showTx: boolean;
  showSender: boolean;
  chainData?: ClusterChainConfig;
  exchangeRate?: string;
};

const UserOpsTableItem = ({ item, isLoading, showTx, showSender, chainData, exchangeRate }: Props) => {
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
        <UserOpStatus status={ item.status } loading={ isLoading }/>
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
          <NativeCoinValue amount={ item.fee } loading={ isLoading } exchangeRate={ exchangeRate } layout="vertical" noSymbol/>
        </TableCell>
      ) }
    </TableRow>
  );
};

export default UserOpsTableItem;
