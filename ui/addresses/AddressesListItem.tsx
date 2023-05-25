import { Flex, HStack, Skeleton } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { AddressesItem } from 'types/api/addresses';

import appConfig from 'configs/app/config';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import Tag from 'ui/shared/chakra/Tag';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';

type Props = {
  item: AddressesItem;
  index: number;
  totalSupply: string;
  isLoading?: boolean;
}

const AddressesListItem = ({
  item,
  index,
  totalSupply,
  isLoading,
}: Props) => {

  const addressBalance = BigNumber(item.coin_balance).div(BigNumber(10 ** appConfig.network.currency.decimals));

  return (
    <ListItemMobile rowGap={ 3 }>
      <Flex alignItems="center" justifyContent="space-between" w="100%">
        <Address maxW="100%" mr={ 8 }>
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
        <Skeleton isLoaded={ !isLoading } fontSize="sm" ml="auto" minW={ 6 } color="text_secondary">
          <span>{ index }</span>
        </Skeleton>
      </Flex>
      { item.public_tags !== null && item.public_tags.length > 0 && item.public_tags.map(tag => (
        <Tag key={ tag.label } isLoading={ isLoading }>{ tag.display_name }</Tag>
      )) }
      <HStack spacing={ 3 }>
        <Skeleton isLoaded={ !isLoading } fontSize="sm" fontWeight={ 500 }>{ `Balance ${ appConfig.network.currency.symbol }` }</Skeleton>
        <Skeleton isLoaded={ !isLoading } fontSize="sm" color="text_secondary">
          <span>{ addressBalance.dp(8).toFormat() }</span>
        </Skeleton>
      </HStack>
      { totalSupply && totalSupply !== '0' && (
        <HStack spacing={ 3 }>
          <Skeleton isLoaded={ !isLoading } fontSize="sm" fontWeight={ 500 }>Percentage</Skeleton>
          <Skeleton isLoaded={ !isLoading } fontSize="sm" color="text_secondary">
            <span>{ addressBalance.div(BigNumber(totalSupply)).multipliedBy(100).dp(8).toFormat() + '%' }</span>
          </Skeleton>
        </HStack>
      ) }
      <HStack spacing={ 3 }>
        <Skeleton isLoaded={ !isLoading } fontSize="sm" fontWeight={ 500 }>Txn count</Skeleton>
        <Skeleton isLoaded={ !isLoading } fontSize="sm" color="text_secondary">
          <span>{ Number(item.tx_count).toLocaleString() }</span>
        </Skeleton>
      </HStack>
    </ListItemMobile>
  );
};

export default React.memo(AddressesListItem);
