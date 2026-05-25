// SPDX-License-Identifier: LicenseRef-Blockscout

import { HStack } from '@chakra-ui/react';
import React from 'react';

import type { AddressesItem } from 'client/slices/address/types/api';

import AddressEntity from 'client/slices/address/components/entity/AddressEntity';
import { currencyUnits } from 'client/slices/chain/units';

import ListItemMobile from 'client/shared/lists/ListItemMobile';
import NativeCoinValue from 'client/shared/values/entity/NativeCoinValue';

import { Skeleton } from 'toolkit/chakra/skeleton';

type Props = {
  item: AddressesItem;
  isLoading?: boolean;
};

const TagSearchListItem = ({
  item,
  isLoading,
}: Props) => {

  return (
    <ListItemMobile rowGap={ 3 }>
      <AddressEntity
        address={ item }
        isLoading={ isLoading }
        fontWeight={ 700 }
        w="100%"
      />
      <HStack gap={ 3 } maxW="100%" alignItems="flex-start">
        <Skeleton loading={ isLoading } fontSize="sm" fontWeight={ 500 } flexShrink={ 0 }>{ `Balance ${ currencyUnits.ether }` }</Skeleton>
        <NativeCoinValue
          amount={ item.coin_balance }
          noSymbol
          loading={ isLoading }
          fontSize="sm"
          color="text.secondary"
        />
      </HStack>
      <HStack gap={ 3 }>
        <Skeleton loading={ isLoading } fontSize="sm" fontWeight={ 500 }>Txn count</Skeleton>
        <Skeleton loading={ isLoading } fontSize="sm" color="text.secondary">
          <span>{ Number(item.transactions_count).toLocaleString() }</span>
        </Skeleton>
      </HStack>
    </ListItemMobile>
  );
};

export default React.memo(TagSearchListItem);
