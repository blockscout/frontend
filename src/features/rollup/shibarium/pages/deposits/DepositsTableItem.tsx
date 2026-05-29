// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { ShibariumDepositsItem } from 'src/features/rollup/shibarium/types/api';

import AddressStringOrParam from 'src/slices/address/components/entity/AddressStringOrParam';
import TxEntity from 'src/slices/tx/components/entity/TxEntity';

import BlockEntityL1 from 'src/features/rollup/common/components/BlockEntityL1';
import TxEntityL1 from 'src/features/rollup/common/components/TxEntityL1';

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
        <BlockEntityL1
          number={ item.l1_block_number }
          isLoading={ isLoading }
          textStyle="sm"
          fontWeight={ 600 }
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <TxEntityL1
          isLoading={ isLoading }
          hash={ item.l1_transaction_hash }
          truncation="constant_long"
          textStyle="sm"
          noCopy
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
        <AddressStringOrParam
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
