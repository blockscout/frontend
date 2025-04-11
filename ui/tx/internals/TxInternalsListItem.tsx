import { Flex, HStack } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { InternalTransaction } from 'types/api/internalTransaction';

import config from 'configs/app';
import { currencyUnits } from 'lib/units';
import { Badge } from 'toolkit/chakra/badge';
import { Skeleton } from 'toolkit/chakra/skeleton';
import AddressFromTo from 'ui/shared/address/AddressFromTo';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import TxStatus from 'ui/shared/statusTag/TxStatus';
import { TX_INTERNALS_ITEMS } from 'ui/tx/internals/utils';

type Props = InternalTransaction & { isLoading?: boolean };

const TxInternalsListItem = ({ type, from, to, value, success, error, gas_limit: gasLimit, created_contract: createdContract, isLoading }: Props) => {
  const typeTitle = TX_INTERNALS_ITEMS.find(({ id }) => id === type)?.title;
  const toData = to ? to : createdContract;

  return (
    <ListItemMobile rowGap={ 3 }>
      <Flex columnGap={ 2 }>
        { typeTitle && <Badge colorPalette="cyan" loading={ isLoading }>{ typeTitle }</Badge> }
        <TxStatus status={ success ? 'ok' : 'error' } errorText={ error } isLoading={ isLoading }/>
      </Flex>
      <AddressFromTo
        from={ from }
        to={ toData }
        isLoading={ isLoading }
        w="100%"
        fontWeight="500"
      />
      <HStack gap={ 3 }>
        <Skeleton loading={ isLoading } fontSize="sm" fontWeight={ 500 }><span>Value { currencyUnits.ether }</span></Skeleton>
        <Skeleton loading={ isLoading } fontSize="sm" color="text.secondary">
          <span>
            { BigNumber(value).div(BigNumber(10 ** config.chain.currency.decimals)).toFormat() }
          </span>
        </Skeleton>
      </HStack>
      <HStack gap={ 3 }>
        <Skeleton loading={ isLoading } fontSize="sm" fontWeight={ 500 }><span>Gas limit</span></Skeleton>
        <Skeleton loading={ isLoading } fontSize="sm" color="text.secondary"><span>{ BigNumber(gasLimit).toFormat() }</span></Skeleton>
      </HStack>
    </ListItemMobile>
  );
};

export default TxInternalsListItem;
