// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, HStack } from '@chakra-ui/react';
import React from 'react';

import type { InternalTransaction } from 'client/slices/internal-tx/types/api';

import AddressFromTo from 'client/slices/address/components/from-to/AddressFromTo';
import TxStatus from 'client/slices/tx/components/TxStatus';

import { currencyUnits } from 'client/shared/chain/units';

import { Badge } from 'toolkit/chakra/badge';
import { Skeleton } from 'toolkit/chakra/skeleton';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';

import { TX_INTERNALS_ITEMS } from '../../utils/utils';

type Props = InternalTransaction & { isLoading?: boolean };

const TxInternalsListItem = ({ type, from, to, value, success, error, gas_limit: gasLimit, created_contract: createdContract, isLoading }: Props) => {
  const typeTitle = TX_INTERNALS_ITEMS.find(({ id }) => id === type)?.title;
  const toData = to ? to : createdContract;

  return (
    <ListItemMobile rowGap={ 3 }>
      <Flex columnGap={ 2 }>
        { typeTitle && <Badge colorPalette="cyan" loading={ isLoading }>{ typeTitle }</Badge> }
        { !success && <TxStatus status="error" errorText={ error } isLoading={ isLoading }/> }
      </Flex>
      <AddressFromTo
        from={ from }
        to={ toData }
        isLoading={ isLoading }
        w="100%"
        fontWeight="500"
      />
      <HStack gap={ 3 } textStyle="sm" >
        <Skeleton loading={ isLoading } fontWeight={ 500 }><span>Value { currencyUnits.ether }</span></Skeleton>
        <NativeCoinValue
          amount={ value }
          noSymbol
          loading={ isLoading }
          color="text.secondary"
        />
      </HStack>
      <HStack gap={ 3 } textStyle="sm" >
        <Skeleton loading={ isLoading } fontWeight={ 500 }><span>Gas limit</span></Skeleton>
        <NativeCoinValue
          amount={ gasLimit }
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
