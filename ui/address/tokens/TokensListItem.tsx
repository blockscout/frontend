import { Flex, HStack, Text } from '@chakra-ui/react';
import React from 'react';

import type { AddressTokenBalance } from 'types/api/address';

import getCurrencyValue from 'lib/getCurrencyValue';
import AddressLink from 'ui/shared/address/AddressLink';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import ListItemMobile from 'ui/shared/ListItemMobile';
import TokenLogo from 'ui/shared/TokenLogo';

import AddressAddToMetaMask from '../details/AddressAddToMetaMask';

type Props = AddressTokenBalance;

const TokensListItem = ({ token, value }: Props) => {

  const tokenString = [ token.name, token.symbol && `(${ token.symbol })` ].filter(Boolean).join(' ');

  const {
    valueStr: tokenQuantity,
    usd: tokenValue,
  } = getCurrencyValue({ value: value, exchangeRate: token.exchange_rate, decimals: token.decimals, accuracy: 8, accuracyUsd: 2 });

  return (
    <ListItemMobile rowGap={ 2 }>
      <Flex alignItems="center" width="100%">
        <TokenLogo hash={ token.address } name={ token.name } boxSize={ 6 } mr={ 2 }/>
        <AddressLink fontWeight="700" hash={ token.address } type="token" alias={ tokenString }/>
      </Flex>
      <Flex alignItems="center" pl={ 8 }>
        <AddressLink hash={ token.address } type="address" truncation="constant"/>
        <CopyToClipboard text={ token.address } ml={ 1 }/>
        <AddressAddToMetaMask token={ token } ml={ 2 }/>
      </Flex>
      { token.exchange_rate !== undefined && token.exchange_rate !== null && (
        <HStack spacing={ 3 }>
          <Text fontSize="sm" fontWeight={ 500 }>Price</Text>
          <Text fontSize="sm" variant="secondary">{ `$${ token.exchange_rate }` }</Text>
        </HStack>
      ) }
      <HStack spacing={ 3 }>
        <Text fontSize="sm" fontWeight={ 500 }>Quantity</Text>
        <Text fontSize="sm" variant="secondary">{ tokenQuantity }</Text>
      </HStack>
      { tokenValue !== undefined && (
        <HStack spacing={ 3 }>
          <Text fontSize="sm" fontWeight={ 500 }>Value</Text>
          <Text fontSize="sm" variant="secondary">{ tokenValue }</Text>
        </HStack>
      ) }
    </ListItemMobile>
  );
};

export default TokensListItem;
