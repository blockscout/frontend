import { Tr, Td, Text, Skeleton } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { AddressesItem } from 'types/api/addresses';

import config from 'configs/app';
import Tag from 'ui/shared/chakra/Tag';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

type Props = {
  item: AddressesItem;
  index: number;
  totalSupply: BigNumber;
  hasPercentage: boolean;
  isLoading?: boolean;
}

const AddressesTableItem = ({
  item,
  index,
  totalSupply,
  hasPercentage,
  isLoading,
}: Props) => {

  const addressBalance = BigNumber(item.coin_balance).div(BigNumber(10 ** config.chain.currency.decimals));
  const addressBalanceChunks = addressBalance.dp(8).toFormat().split('.');

  return (
    <Tr>
      <Td>
        <Skeleton isLoaded={ !isLoading } display="inline-block" minW={ 6 } lineHeight="24px">
          { index }
        </Skeleton>
      </Td>
      <Td verticalAlign="middle">
        <AddressEntity
          address={ item }
          isLoading={ isLoading }
          fontWeight={ 700 }
        />
      </Td>
      <Td pl={ 10 }>
        { item.public_tags && item.public_tags.length ? item.public_tags.map(tag => (
          <Tag key={ tag.label } isLoading={ isLoading } isTruncated>{ tag.display_name }</Tag>
        )) : null }
      </Td>
      <Td isNumeric>
        <Skeleton isLoaded={ !isLoading } display="inline-block">
          <Text lineHeight="24px" as="span">{ addressBalanceChunks[0] }</Text>
          { addressBalanceChunks[1] && <Text lineHeight="24px" as="span">.</Text> }
          <Text lineHeight="24px" variant="secondary" as="span">{ addressBalanceChunks[1] }</Text>
        </Skeleton>
      </Td>
      { hasPercentage && (
        <Td isNumeric>
          <Text lineHeight="24px">{ addressBalance.div(totalSupply).multipliedBy(100).dp(8).toFormat() + '%' }</Text>
        </Td>
      ) }
      <Td isNumeric>
        <Skeleton isLoaded={ !isLoading } display="inline-block" lineHeight="24px">
          { Number(item.tx_count).toLocaleString() }
        </Skeleton>
      </Td>
    </Tr>
  );
};

export default React.memo(AddressesTableItem);
