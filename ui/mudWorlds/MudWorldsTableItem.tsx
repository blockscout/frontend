import { Text, Td, Tr, Skeleton } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { MudWorldItem } from 'types/api/mudWorlds';

import config from 'configs/app';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

type Props = { item: MudWorldItem; isLoading?: boolean };

const MudWorldsTableItem = ({ item, isLoading }: Props) => {
  const addressBalance = BigNumber(item.coin_balance).div(BigNumber(10 ** config.chain.currency.decimals));
  const addressBalanceChunks = addressBalance.dp(8).toFormat().split('.');

  return (
    <Tr>
      <Td verticalAlign="middle">
        <AddressEntity address={ item.address } isLoading={ isLoading } fontWeight={ 700 }/>
      </Td>
      <Td isNumeric>
        <Skeleton isLoaded={ !isLoading } display="inline-block" maxW="100%">
          <Text lineHeight="24px" as="span">{ addressBalanceChunks[0] + (addressBalanceChunks[1] ? '.' : '') }</Text>
          <Text lineHeight="24px" variant="secondary" as="span">{ addressBalanceChunks[1] }</Text>
        </Skeleton>
      </Td>
      <Td isNumeric>
        <Skeleton isLoaded={ !isLoading } display="inline-block" lineHeight="24px">
          { Number(item.tx_count).toLocaleString() }
        </Skeleton>
      </Td>
    </Tr>
  );
};

export default MudWorldsTableItem;
