import { Flex, HStack, Text } from '@chakra-ui/react';
import React from 'react';

import type { AddressTokenBalance } from 'types/api/address';

import AddressAddToWallet from 'ui/shared/address/AddressAddToWallet';
import AddressLink from 'ui/shared/address/AddressLink';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import TokenLogo from 'ui/shared/TokenLogo';

type Props = AddressTokenBalance;

const ERC721TokensListItem = ({ token, value }: Props) => {

  const tokenString = [ token.name, token.symbol && `(${ token.symbol })` ].filter(Boolean).join(' ');

  return (
    <ListItemMobile rowGap={ 2 }>
      <Flex alignItems="center" width="100%">
        <TokenLogo data={ token } boxSize={ 6 } mr={ 2 }/>
        <AddressLink fontWeight="700" hash={ token.address } type="token" alias={ tokenString }/>
      </Flex>
      <Flex alignItems="center" pl={ 8 }>
        <AddressLink hash={ token.address } type="address" truncation="constant"/>
        <CopyToClipboard text={ token.address } ml={ 1 }/>
        <AddressAddToWallet token={ token } ml={ 2 }/>
      </Flex>
      <HStack spacing={ 3 }>
        <Text fontSize="sm" fontWeight={ 500 }>Quantity</Text>
        <Text fontSize="sm" variant="secondary">{ value }</Text>
      </HStack>
    </ListItemMobile>
  );
};

export default ERC721TokensListItem;
