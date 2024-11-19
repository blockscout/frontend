import { Tr, Td, Text, Skeleton } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { AddressesItem } from 'types/api/addresses';

import config from 'configs/app';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

type Props = {
  item: AddressesItem;
  isLoading?: boolean;
};

const AddressesLabelSearchTableItem = ({
  item,
  isLoading,
}: Props) => {

  const addressBalance = BigNumber(item.coin_balance || 0).div(BigNumber(10 ** config.chain.currency.decimals));
  const addressBalanceChunks = addressBalance.dp(8).toFormat().split('.');

  return (
    <Tr>
      <Td>
        <AddressEntity
          address={ item }
          isLoading={ isLoading }
          fontWeight={ 700 }
          my="2px"
        />
      </Td>
      <Td isNumeric>
        <Skeleton isLoaded={ !isLoading } display="inline-block" maxW="100%">
          <Text lineHeight="24px" as="span">{ addressBalanceChunks[0] + (addressBalanceChunks[1] ? '.' : '') }</Text>
          <Text lineHeight="24px" variant="secondary" as="span">{ addressBalanceChunks[1] }</Text>
        </Skeleton>
      </Td>
      <Td isNumeric>
        <Skeleton isLoaded={ !isLoading } display="inline-block" lineHeight="24px">
          { Number(item.transaction_count).toLocaleString() }
        </Skeleton>
      </Td>
    </Tr>
  );
};

export default React.memo(AddressesLabelSearchTableItem);
