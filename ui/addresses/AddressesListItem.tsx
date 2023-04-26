import { Flex, Tag, Text, HStack } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { AddressesItem } from 'types/api/addresses';

import appConfig from 'configs/app/config';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';

type Props = {
  item: AddressesItem;
  index: number;
  totalSupply: string;
}

const AddressesListItem = ({
  item,
  index,
  totalSupply,
}: Props) => {

  const addressBalance = BigNumber(item.coin_balance).div(BigNumber(10 ** appConfig.network.currency.decimals));

  return (
    <ListItemMobile rowGap={ 3 }>
      <Flex alignItems="center" justifyContent="space-between" w="100%">
        <Address maxW="100%" mr={ 8 }>
          <AddressIcon address={ item } mr={ 2 }/>
          <AddressLink
            fontWeight={ 700 }
            flexGrow={ 1 }
            w="calc(100% - 32px)"
            hash={ item.hash }
            alias={ item.name }
            type="address"
          />
        </Address>
        <Text fontSize="sm" ml="auto" variant="secondary">{ index }</Text>
      </Flex>
      { item.public_tags !== null && item.public_tags.length > 0 && item.public_tags.map(tag => (
        <Tag key={ tag.label }>{ tag.display_name }</Tag>
      )) }
      <HStack spacing={ 3 }>
        <Text fontSize="sm" fontWeight={ 500 }>{ `Balance ${ appConfig.network.currency.symbol }` }</Text>
        <Text fontSize="sm" variant="secondary">{ addressBalance.dp(8).toFormat() }</Text>
      </HStack>
      { totalSupply && totalSupply !== '0' && (
        <HStack spacing={ 3 }>
          <Text fontSize="sm" fontWeight={ 500 }>Percentage</Text>
          <Text fontSize="sm" variant="secondary">{ addressBalance.div(BigNumber(totalSupply)).multipliedBy(100).dp(8).toFormat() + '%' }</Text>
        </HStack>
      ) }
      <HStack spacing={ 3 }>
        <Text fontSize="sm" fontWeight={ 500 }>Txn count</Text>
        <Text fontSize="sm" variant="secondary">{ Number(item.tx_count).toLocaleString() }</Text>
      </HStack>
    </ListItemMobile>
  );
};

export default React.memo(AddressesListItem);
