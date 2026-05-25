// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { MudWorldItem } from 'client/features/chain-variants/mud/types/api';

import AddressEntity from 'client/slices/address/components/entity/AddressEntity';

import NativeCoinValue from 'client/shared/values/entity/NativeCoinValue';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';

type Props = { item: MudWorldItem; isLoading?: boolean };

const MudWorldsTableItem = ({ item, isLoading }: Props) => {
  return (
    <TableRow>
      <TableCell verticalAlign="middle">
        <AddressEntity address={ item.address } isLoading={ isLoading } fontWeight={ 700 }/>
      </TableCell>
      <TableCell isNumeric>
        <NativeCoinValue
          amount={ item.coin_balance }
          noSymbol
          loading={ isLoading }
          lineHeight="24px"
        />
      </TableCell>
      <TableCell isNumeric>
        <Skeleton loading={ isLoading } display="inline-block" lineHeight="24px">
          { Number(item.transactions_count).toLocaleString() }
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default MudWorldsTableItem;
