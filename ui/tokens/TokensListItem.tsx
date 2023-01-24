import { Flex, Text, Tag, HStack, Grid, GridItem } from '@chakra-ui/react';
import React from 'react';

import type { TokenInfo } from 'types/api/tokenInfo';

import getCurrencyValue from 'lib/getCurrencyValue';
import AddressAddToMetaMask from 'ui/address/details/AddressAddToMetaMask';
import AddressLink from 'ui/shared/address/AddressLink';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import ListItemMobile from 'ui/shared/ListItemMobile';
import TokenLogo from 'ui/shared/TokenLogo';

type Props = {
  token: TokenInfo;
  index: number;
  page: number;
}

const PAGE_SIZE = 50;

const TokensTableItem = ({
  token,
  page,
  index,
}: Props) => {

  const {
    address,
    total_supply: totalSupply,
    exchange_rate: exchangeRate,
    type,
    name,
    symbol,
    decimals,
    holders,
  } = token;

  const totalValue = totalSupply !== null ? getCurrencyValue({ value: totalSupply, accuracy: 3, accuracyUsd: 2, exchangeRate, decimals }) : undefined;

  const tokenString = [ name, symbol && `(${ symbol })` ].filter(Boolean).join(' ');

  return (
    <ListItemMobile rowGap={ 3 }>
      <Grid
        width="100%"
        gridTemplateColumns="minmax(0, 1fr)"
      >
        <GridItem display="flex">
          <Flex overflow="hidden" mr={ 3 } alignItems="center">
            <TokenLogo hash={ address } name={ name } boxSize={ 6 } mr={ 2 }/>
            <AddressLink fontSize="sm" fontWeight="700" hash={ address } type="token" alias={ tokenString }/>
            <Tag flexShrink={ 0 } ml={ 3 }>{ type }</Tag>
          </Flex>
          <Text fontSize="sm" ml="auto" variant="secondary">{ (page - 1) * PAGE_SIZE + index + 1 }</Text>
        </GridItem>
      </Grid>
      <Flex justifyContent="space-between" alignItems="center" width="100%">
        <Flex alignItems="center" width="136px" justifyContent="space-between" ml={ 8 } mt="-8px">
          <Flex alignItems="center">
            <AddressLink fontSize="sm" hash={ address } type="address" truncation="constant"/>
            <CopyToClipboard text={ address } ml={ 1 }/>
          </Flex>
          <AddressAddToMetaMask token={ token }/>
        </Flex>
      </Flex>
      { exchangeRate && (
        <HStack spacing={ 3 }>
          <Text fontSize="sm" fontWeight={ 500 }>Price</Text>
          <Text fontSize="sm" variant="secondary">{ exchangeRate || '-' }</Text>
        </HStack>
      ) }
      { totalValue?.usd && (
        <HStack spacing={ 3 }>
          <Text fontSize="sm" fontWeight={ 500 }>On-chain market cap</Text>
          <Text fontSize="sm" variant="secondary">{ totalValue.usd }</Text>
        </HStack>
      ) }
      <HStack spacing={ 3 }>
        <Text fontSize="sm" fontWeight={ 500 }>Holders</Text>
        <Text fontSize="sm" variant="secondary">{ holders }</Text>
      </HStack>
    </ListItemMobile>
  );
};

export default TokensTableItem;
