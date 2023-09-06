import { Flex, Text, LinkBox, LinkOverlay, useColorModeValue, Skeleton } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import type { TokenInstance } from 'types/api/token';

import useIsMobile from 'lib/hooks/useIsMobile';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import LinkInternal from 'ui/shared/LinkInternal';
import NftMedia from 'ui/shared/nft/NftMedia';
import TruncatedTextTooltip from 'ui/shared/TruncatedTextTooltip';

type Props = { item: TokenInstance; isLoading: boolean };

const NFTItem = ({ item, isLoading }: Props) => {

  const isMobile = useIsMobile();

  const mediaElement = (
    <NftMedia
      mb="18px"
      url={ item.animation_url || item.image_url }
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
          <AddressEntity
            address={ item.owner }
            isLoading={ isLoading }
            truncation="constant"
            noCopy
            noIcon={ isMobile }
          />
        </Flex>
      ) }
    </LinkBox>
  );
};

export default NFTItem;
