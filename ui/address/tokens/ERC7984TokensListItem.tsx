import { Flex, HStack } from '@chakra-ui/react';
import React from 'react';

import type { AddressTokenBalance } from 'types/api/address';

import config from 'configs/app';
import { Skeleton } from 'toolkit/chakra/skeleton';
import AddressAddToWallet from 'ui/shared/address/AddressAddToWallet';
import NativeTokenTag from 'ui/shared/celo/NativeTokenTag';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';

const celoFeature = config.features.celo;

type Props = AddressTokenBalance & { isLoading: boolean };

const ERC7984TokensListItem = ({ token, isLoading }: Props) => {

  const isNativeToken = celoFeature.isEnabled && token.address_hash.toLowerCase() === celoFeature.nativeTokenAddress?.toLowerCase();

  return (
    <ListItemMobile rowGap={ 2 }>
      <Flex alignItems="center" width="100%" columnGap={ 2 }>
        <TokenEntity
          token={ token }
          isLoading={ isLoading }
          noCopy
          jointSymbol
          fontWeight="700"
          width="auto"
        />
        { isNativeToken && <NativeTokenTag/> }
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
          <span>•••••</span>
        </Skeleton>
      </HStack>
      <HStack gap={ 3 } alignItems="baseline">
        <Skeleton loading={ isLoading } fontSize="sm" fontWeight={ 500 }>Value</Skeleton>
        <Skeleton loading={ isLoading } fontSize="sm" color="text.secondary" whiteSpace="pre-wrap" wordBreak="break-word">
          <span>•••••</span>
        </Skeleton>
      </HStack>
    </ListItemMobile>
  );
};

export default ERC7984TokensListItem;
