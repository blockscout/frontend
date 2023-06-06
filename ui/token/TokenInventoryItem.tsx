import { Flex, Text, LinkBox, LinkOverlay, useColorModeValue, Hide, Skeleton } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import type { TokenInstance } from 'types/api/token';

import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import LinkInternal from 'ui/shared/LinkInternal';
import NftMedia from 'ui/shared/nft/NftMedia';
import TruncatedTextTooltip from 'ui/shared/TruncatedTextTooltip';

type Props = { item: TokenInstance; isLoading: boolean };

const NFTItem = ({ item, isLoading }: Props) => {

  const mediaElement = (
    <NftMedia
      mb="18px"
      imageUrl={ item.image_url }
      animationUrl={ item.animation_url }
      isLoading={ isLoading }
    />
  );

  return (
    <LinkBox
      w={{ base: '100%', lg: '210px' }}
      border="1px solid"
      borderColor={ useColorModeValue('blackAlpha.100', 'whiteAlpha.200') }
      borderRadius="12px"
      p="10px"
      _hover={{ boxShadow: isLoading ? 'none' : 'md' }}
      fontSize="sm"
      fontWeight={ 500 }
      lineHeight="20px"
    >
      { isLoading ? mediaElement : (
        <NextLink
          href={{ pathname: '/token/[hash]/instance/[id]', query: { hash: item.token.address, id: item.id } }}
          passHref
          legacyBehavior
        >
          <LinkOverlay>
            { mediaElement }
          </LinkOverlay>
        </NextLink>
      ) }
      { item.id && (
        <Flex mb={ 2 } ml={ 1 }>
          <Text whiteSpace="pre" variant="secondary">ID# </Text>
          <TruncatedTextTooltip label={ item.id }>
            <Skeleton isLoaded={ !isLoading } overflow="hidden">
              <LinkInternal
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                display="block"
                isLoading={ isLoading }
              >
                { item.id }
              </LinkInternal>
            </Skeleton>
          </TruncatedTextTooltip>
        </Flex>
      ) }
      { item.owner && (
        <Flex mb={ 2 } ml={ 1 }>
          <Text whiteSpace="pre" variant="secondary" mr={ 2 } lineHeight="24px">Owner</Text>
          <Address>
            <Hide below="lg" ssr={ false }><AddressIcon address={ item.owner } mr={ 1 } isLoading={ isLoading }/></Hide>
            <AddressLink hash={ item.owner.hash } alias={ item.owner.name } type="address" truncation="constant" isLoading={ isLoading }/>
          </Address>
        </Flex>
      ) }
    </LinkBox>
  );
};

export default NFTItem;
