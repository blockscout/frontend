import { Flex, Link, Text, LinkBox, LinkOverlay, useColorModeValue, Skeleton } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import type { AddressTokenBalance } from 'types/api/address';

import NftMedia from 'ui/shared/nft/NftMedia';
import TokenLogo from 'ui/shared/TokenLogo';
import TruncatedTextTooltip from 'ui/shared/TruncatedTextTooltip';

type Props = AddressTokenBalance & { isLoading: boolean };

const NFTItem = ({ token, token_id: tokenId, token_instance: tokenInstance, isLoading }: Props) => {
  const tokenLink = route({ pathname: '/token/[hash]', query: { hash: token.address } });

  return (
    <LinkBox
      w={{ base: '100%', lg: '210px' }}
      border="1px solid"
      borderColor={ useColorModeValue('blackAlpha.100', 'whiteAlpha.200') }
      borderRadius="12px"
      p="10px"
      _hover={{ boxShadow: 'md' }}
      fontSize="sm"
      fontWeight={ 500 }
      lineHeight="20px"
    >
      <LinkOverlay href={ isLoading ? undefined : tokenLink }>
        <NftMedia
          mb="18px"
          imageUrl={ tokenInstance?.image_url || null }
          animationUrl={ tokenInstance?.animation_url || null }
          isLoading={ isLoading }
        />
      </LinkOverlay>
      { tokenId && (
        <Flex mb={ 2 } ml={ 1 }>
          <Text whiteSpace="pre" variant="secondary">ID# </Text>
          <TruncatedTextTooltip label={ tokenId }>
            <Skeleton isLoaded={ !isLoading } overflow="hidden" h="20px">
              <Link
                w="100%"
                display="inline-block"
                whiteSpace="nowrap"
                textOverflow="ellipsis"
                overflow="hidden"
                href={ route({ pathname: '/token/[hash]/instance/[id]', query: { hash: token.address, id: tokenId } }) }
              >
                { tokenId }
              </Link>
            </Skeleton>
          </TruncatedTextTooltip>
        </Flex>
      ) }
      { token.name && (
        <Flex alignItems="center">
          <TokenLogo data={ token } boxSize={ 6 } ml={ 1 } mr={ 1 } isLoading={ isLoading }/>
          <TruncatedTextTooltip label={ token.name }>
            <Skeleton isLoaded={ !isLoading } color="text_secondary" overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
              <span>{ token.name }</span>
            </Skeleton>
          </TruncatedTextTooltip>
        </Flex>
      ) }
    </LinkBox>
  );
};

export default NFTItem;
