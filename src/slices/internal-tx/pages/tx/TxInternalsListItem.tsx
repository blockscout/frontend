// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, HStack } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import AddressFromTo from 'src/slices/address/components/from-to/AddressFromTo';
import { currencyUnits } from 'src/slices/chain/units';
import TxStatus from 'src/slices/tx/components/TxStatus';

import ListItemMobile from 'src/shared/lists/ListItemMobile';
import NativeCoinValue from 'src/shared/values/entity/NativeCoinValue';

import { Badge } from 'src/toolkit/chakra/badge';
import { Skeleton } from 'src/toolkit/chakra/skeleton';

import { TX_INTERNALS_ITEMS } from '../../utils/utils';

interface Props {
  data: schemas['InternalTransaction'];
  isLoading?: boolean;
}

const TxInternalsListItem = ({ data, isLoading }: Props) => {
  const typeTitle = TX_INTERNALS_ITEMS.find(({ id }) => id === data.type)?.title;
  const toData = data.to ? data.to : data.created_contract;

  return (
    <ListItemMobile rowGap={ 3 }>
      <Flex columnGap={ 2 }>
        { typeTitle && <Badge colorPalette="cyan" loading={ isLoading }>{ typeTitle }</Badge> }
        { !data.success && <TxStatus status="error" errorText={ data.error } isLoading={ isLoading }/> }
      </Flex>
      <AddressFromTo
        from={ data.from }
        to={ toData }
        isLoading={ isLoading }
        w="100%"
        fontWeight="500"
      />
      <HStack gap={ 3 } textStyle="sm" >
        <Skeleton loading={ isLoading } fontWeight={ 500 }><span>Value { currencyUnits.ether }</span></Skeleton>
        <NativeCoinValue
          amount={ data.value }
          noSymbol
          loading={ isLoading }
          color="text.secondary"
        />
      </HStack>
      <HStack gap={ 3 } textStyle="sm" >
        <Skeleton loading={ isLoading } fontWeight={ 500 }><span>Gas limit</span></Skeleton>
        <NativeCoinValue
          amount={ data.gas_limit }
          units="wei"
          noSymbol
          loading={ isLoading }
          color="text.secondary"
        />
      </HStack>
    </ListItemMobile>
  );
};

export default TxInternalsListItem;
