import { Flex, HStack, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { AddressTokenBalance } from 'types/api/address';

import getCurrencyValue from 'lib/getCurrencyValue';
import AddressAddToWallet from 'ui/shared/address/AddressAddToWallet';
import AddressLink from 'ui/shared/address/AddressLink';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import TokenLogo from 'ui/shared/TokenLogo';

type Props = AddressTokenBalance & { isLoading: boolean};

const ERC20TokensListItem = ({ token, value, isLoading }: Props) => {

  const tokenString = [ token.name, token.symbol && `(${ token.symbol })` ].filter(Boolean).join(' ');

  const {
    valueStr: tokenQuantity,
    usd: tokenValue,
  } = getCurrencyValue({ value: value, exchangeRate: token.exchange_rate, decimals: token.decimals, accuracy: 8, accuracyUsd: 2 });

  return (
    <ListItemMobile rowGap={ 2 }>
      <Flex alignItems="center" width="100%">
        <TokenLogo data={ token } boxSize={ 6 } mr={ 2 } isLoading={ isLoading }/>
        <AddressLink fontWeight="700" hash={ token.address } type="token" alias={ tokenString } isLoading={ isLoading }/>
      </Flex>
      <Flex alignItems="center" pl={ 8 }>
        <AddressLink hash={ token.address } type="address" truncation="constant" isLoading={ isLoading }/>
        <CopyToClipboard text={ token.address } isLoading={ isLoading }/>
        <AddressAddToWallet token={ token } ml={ 2 } isLoading={ isLoading }/>
      </Flex>
      { token.exchange_rate !== undefined && token.exchange_rate !== null && (
        <HStack spacing={ 3 }>
          <Skeleton isLoaded={ !isLoading } fontSize="sm" fontWeight={ 500 }>Price</Skeleton>
          <Skeleton isLoaded={ !isLoading } fontSize="sm" color="text_secondary">
            <span>{ `$${ token.exchange_rate }` }</span>
          </Skeleton>
        </HStack>
      ) }
      <HStack spacing={ 3 }>
        <Skeleton isLoaded={ !isLoading } fontSize="sm" fontWeight={ 500 }>Quantity</Skeleton>
        <Skeleton isLoaded={ !isLoading } fontSize="sm" color="text_secondary">
          <span>{ tokenQuantity }</span>
        </Skeleton>
      </HStack>
      { tokenValue !== undefined && (
        <HStack spacing={ 3 }>
          <Skeleton isLoaded={ !isLoading } fontSize="sm" fontWeight={ 500 }>Value</Skeleton>
          <Skeleton isLoaded={ !isLoading } fontSize="sm" color="text_secondary">
            <span>{ tokenValue }</span>
          </Skeleton>
        </HStack>
      ) }
    </ListItemMobile>
  );
};

export default ERC20TokensListItem;
