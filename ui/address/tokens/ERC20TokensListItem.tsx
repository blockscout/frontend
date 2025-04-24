import { Flex, HStack } from '@chakra-ui/react';
import React from 'react';

import type { AddressTokenBalance } from 'types/api/address';

import getCurrencyValue from 'lib/getCurrencyValue';
import { Skeleton } from 'toolkit/chakra/skeleton';
import AddressAddToWallet from 'ui/shared/address/AddressAddToWallet';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';

type Props = AddressTokenBalance & { isLoading: boolean };

const ERC20TokensListItem = ({ token, value, isLoading }: Props) => {

  const {
    valueStr: tokenQuantity,
    usd: tokenValue,
  } = getCurrencyValue({ value: value, exchangeRate: token.exchange_rate, decimals: token.decimals, accuracy: 8, accuracyUsd: 2 });

  return (
    <ListItemMobile rowGap={ 2 }>
      <Flex alignItems="center" width="100%">
        <TokenEntity
          token={ token }
          isLoading={ isLoading }
          noCopy
          jointSymbol
          fontWeight="700"
        />
      </Flex>
      <Flex alignItems="center" pl={ 8 }>
        <AddressEntity
          address={{ hash: token.address_hash }}
          isLoading={ isLoading }
          truncation="constant"
          noIcon
        />
        <AddressAddToWallet token={ token } ml={ 2 } isLoading={ isLoading }/>
      </Flex>
      { token.exchange_rate !== undefined && token.exchange_rate !== null && (
        <HStack gap={ 3 }>
          <Skeleton loading={ isLoading } fontSize="sm" fontWeight={ 500 }>Price</Skeleton>
          <Skeleton loading={ isLoading } fontSize="sm" color="text.secondary">
            <span>{ `$${ Number(token.exchange_rate).toLocaleString() }` }</span>
          </Skeleton>
        </HStack>
      ) }
      <HStack gap={ 3 } alignItems="baseline">
        <Skeleton loading={ isLoading } fontSize="sm" fontWeight={ 500 }>Quantity</Skeleton>
        <Skeleton loading={ isLoading } fontSize="sm" color="text.secondary" whiteSpace="pre-wrap" wordBreak="break-word">
          <span>{ tokenQuantity }</span>
        </Skeleton>
      </HStack>
      { tokenValue !== undefined && (
        <HStack gap={ 3 } alignItems="baseline">
          <Skeleton loading={ isLoading } fontSize="sm" fontWeight={ 500 }>Value</Skeleton>
          <Skeleton loading={ isLoading } fontSize="sm" color="text.secondary" whiteSpace="pre-wrap" wordBreak="break-word">
            <span>${ tokenValue }</span>
          </Skeleton>
        </HStack>
      ) }
    </ListItemMobile>
  );
};

export default ERC20TokensListItem;
