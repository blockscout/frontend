import { Tag, Flex, Text, Link, Skeleton, LightMode } from '@chakra-ui/react';
import React from 'react';

import type { AddressNFT } from 'types/api/address';

import { route } from 'nextjs-routes';

import NftEntity from 'ui/shared/entities/nft/NftEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import NftMedia from 'ui/shared/nft/NftMedia';

import NFTItemContainer from './NFTItemContainer';

type Props = AddressNFT & { isLoading: boolean; withTokenLink?: boolean };

const NFTItem = ({ token, value, isLoading, withTokenLink, ...tokenInstance }: Props) => {
  const tokenInstanceLink = tokenInstance.id ?
    route({ pathname: '/token/[hash]/instance/[id]', query: { hash: token.address, id: tokenInstance.id } }) :
    undefined;

  return (
    <NFTItemContainer position="relative">
      <Skeleton isLoaded={ !isLoading }>
        <LightMode><Tag background="gray.50" zIndex={ 1 } position="absolute" top="18px" right="18px">{ token.type }</Tag></LightMode>
      </Skeleton>
      <Link href={ isLoading ? undefined : tokenInstanceLink }>
        <NftMedia
          mb="18px"
          url={ tokenInstance?.animation_url || tokenInstance?.image_url || null }
          isLoading={ isLoading }
        />
      </Link>
      <Flex justifyContent="space-between" w="100%">
        <Flex ml={ 1 } overflow="hidden">
          <Text whiteSpace="pre" variant="secondary">ID# </Text>
          <NftEntity hash={ token.address } id={ tokenInstance.id } isLoading={ isLoading } noIcon/>
        </Flex>
        <Skeleton isLoaded={ !isLoading }>
          { Number(value) > 1 && <Flex><Text variant="secondary" whiteSpace="pre">Qty </Text>{ value }</Flex> }
        </Skeleton>
      </Flex>
      { withTokenLink && (
        <TokenEntity
          mt={ 2 }
          token={ token }
          isLoading={ isLoading }
          noCopy
          noSymbol
        />
      ) }
    </NFTItemContainer>
  );
};

export default NFTItem;
