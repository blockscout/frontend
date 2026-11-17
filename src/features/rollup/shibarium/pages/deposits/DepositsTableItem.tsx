// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { ShibariumDepositsItem } from 'src/features/rollup/shibarium/types/api';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import BlockEntity from 'src/slices/block/components/entity/BlockEntity';
import TxEntity from 'src/slices/tx/components/entity/TxEntity';

import { parentChain } from 'src/features/rollup/common/utils/parent-chain-entity';

import config from 'src/config';
import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';

import { TableCell, TableRow } from 'src/toolkit/chakra/table';

const feature = config.features.rollup;

type Props = { item: ShibariumDepositsItem; isLoading?: boolean };

const DepositsTableItem = ({ item, isLoading }: Props) => {

  if (!(feature.isEnabled && feature.type === 'shibarium')) {
    return null;
  }

  return (
    <TableRow>
      <TableCell verticalAlign="middle">
        <BlockEntity
          number={ item.l1_block_number }
          isLoading={ isLoading }
          textStyle="sm"
          fontWeight={ 600 }
          chain={ parentChain }
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <TxEntity
          isLoading={ isLoading }
          hash={ item.l1_transaction_hash }
          truncation="constant_long"
          textStyle="sm"
          noCopy
          chain={ parentChain }
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <TxEntity
          isLoading={ isLoading }
          hash={ item.l2_transaction_hash }
          textStyle="sm"
          truncation="constant_long"
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <AddressEntity
          address={ item.user }
          isLoading={ isLoading }
          truncation="constant"
          noCopy
        />
      </TableCell>
      <TableCell verticalAlign="middle" pr={ 12 }>
        <TimeWithTooltip
          timestamp={ item.timestamp }
          isLoading={ isLoading }
          color="text.secondary"
          display="inline-block"
        />
      </TableCell>
    </TableRow>
  );
};

export default DepositsTableItem;
