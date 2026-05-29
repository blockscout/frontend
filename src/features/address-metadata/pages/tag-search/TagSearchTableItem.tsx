// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { AddressesItem } from 'src/slices/address/types/api';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';

import NativeCoinValue from 'src/shared/values/entity/NativeCoinValue';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'src/toolkit/chakra/table';

type Props = {
  item: AddressesItem;
  isLoading?: boolean;
};

const TagSearchTableItem = ({
  item,
  isLoading,
}: Props) => {

  return (
    <TableRow>
      <TableCell>
        <AddressEntity
          address={ item }
          isLoading={ isLoading }
          fontWeight={ 700 }
          my="2px"
        />
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

export default React.memo(TagSearchTableItem);
