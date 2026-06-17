// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import BlockEntity from 'src/slices/block/components/entity/BlockEntity';
import TxEntity from 'src/slices/tx/components/entity/TxEntity';

import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';
import NativeCoinValue from 'src/shared/values/entity/NativeCoinValue';

import { TableCell, TableRow } from 'src/toolkit/chakra/table';

import BeaconChainDepositSignature from '../../components/BeaconChainDepositSignature';
import BeaconChainDepositStatusTag from '../../components/BeaconChainDepositStatusTag';
import BeaconChainValidatorLink from '../../components/BeaconChainValidatorLink';

type Props = {
  item: schemas['Deposit'];
  view: 'list' | 'address' | 'block';
  isLoading?: boolean;
};

const BeaconChainDepositsTableItem = ({ item, view, isLoading }: Props) => {
  return (
    <TableRow>
      <TableCell verticalAlign="middle">
        { item.transaction_hash ? (
          <TxEntity
            hash={ item.transaction_hash }
            isLoading={ isLoading }
            truncation="constant_long"
            noIcon
          />
        ) : '-' }
      </TableCell>
      { view !== 'block' && (
        <TableCell verticalAlign="middle">
          { item.block_number ? (
            <BlockEntity
              number={ item.block_number }
              hash={ item.block_hash }
              isLoading={ isLoading }
              textStyle="sm"
              noIcon
            />
          ) : '-' }
        </TableCell>
      ) }
      { view !== 'block' && (
        <TableCell verticalAlign="middle">
          <TimeWithTooltip
            timestamp={ item.block_timestamp }
            isLoading={ isLoading }
            color="text.secondary"
            display="inline-block"
          />
        </TableCell>
      ) }
      <TableCell verticalAlign="middle">
        <NativeCoinValue amount={ item.amount } loading={ isLoading } noSymbol/>
      </TableCell>
      { view !== 'address' && (
        <TableCell verticalAlign="middle">
          { item.from_address ? (
            <AddressEntity
              address={ item.from_address }
              isLoading={ isLoading }
              truncation="constant"
            />
          ) : '-' }
        </TableCell>
      ) }
      <TableCell verticalAlign="middle" maxW="200px" overflow="hidden">
        { item.pubkey ? <BeaconChainValidatorLink pubkey={ item.pubkey } isLoading={ isLoading }/> : '-' }
      </TableCell>
      <TableCell verticalAlign="middle" maxW="200px" overflow="hidden">
        { item.signature ? <BeaconChainDepositSignature signature={ item.signature } isLoading={ Boolean(isLoading) }/> : '-' }
      </TableCell>
      <TableCell verticalAlign="middle">
        <BeaconChainDepositStatusTag status={ item.status } isLoading={ Boolean(isLoading) }/>
      </TableCell>
    </TableRow>
  );
};

export default BeaconChainDepositsTableItem;
