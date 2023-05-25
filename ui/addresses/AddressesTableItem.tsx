import { Tr, Td, Text, Skeleton } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { AddressesItem } from 'types/api/addresses';

import appConfig from 'configs/app/config';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import Tag from 'ui/shared/chakra/Tag';
import CopyToClipboard from 'ui/shared/CopyToClipboard';

type Props = {
  item: AddressesItem;
  index: number;
  totalSupply: string;
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

  const addressBalance = BigNumber(item.coin_balance).div(BigNumber(10 ** appConfig.network.currency.decimals));
  const addressBalanceChunks = addressBalance.dp(8).toFormat().split('.');

  return (
    <Tr>
      <Td>
        <Skeleton isLoaded={ !isLoading } display="inline-block" minW={ 6 } lineHeight="24px">
          { index }
        </Skeleton>
      </Td>
      <Td>
        <Address display="inline-flex" maxW="100%">
          <AddressIcon address={ item } mr={ 2 } isLoading={ isLoading }/>
          <AddressLink
            fontWeight={ 700 }
            flexGrow={ 1 }
            w="calc(100% - 32px)"
            hash={ item.hash }
            alias={ item.name }
            type="address"
            isLoading={ isLoading }
          />
          <CopyToClipboard text={ item.hash } isLoading={ isLoading }/>
        </Address>
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
          <Text lineHeight="24px">{ addressBalance.div(BigNumber(totalSupply)).multipliedBy(100).dp(8).toFormat() + '%' }</Text>
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
