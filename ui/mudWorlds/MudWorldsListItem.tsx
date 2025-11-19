import { HStack } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { MudWorldItem } from 'types/api/mudWorlds';

import config from 'configs/app';
import { currencyUnits } from 'lib/units';
import { Skeleton } from 'toolkit/chakra/skeleton';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';

type Props = {
  item: MudWorldItem;
  isLoading?: boolean;
};

const MudWorldsListItem = ({
  item,
  isLoading,
}: Props) => {

  const addressBalance = BigNumber(item.coin_balance).div(BigNumber(10 ** config.chain.currency.decimals));

  return (
    <ListItemMobile rowGap={ 3 }>
      <AddressEntity
        address={ item.address }
        isLoading={ isLoading }
        fontWeight={ 700 }
        mr={ 2 }
        truncation="constant_long"
      />
      <HStack gap={ 3 } maxW="100%" alignItems="flex-start">
        <Skeleton loading={ isLoading } fontSize="sm" fontWeight={ 500 } flexShrink={ 0 }>{ `Balance ${ currencyUnits.ether }` }</Skeleton>
        <Skeleton loading={ isLoading } fontSize="sm" color="text.secondary" minW="0" whiteSpace="pre-wrap">
          <span>{ addressBalance.dp(8).toFormat() }</span>
        </Skeleton>
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

export default React.memo(MudWorldsListItem);
