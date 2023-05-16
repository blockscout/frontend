import { Flex, Link, Text, LinkBox, LinkOverlay, useColorModeValue } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import type { AddressTokenBalance } from 'types/api/address';

import NftMedia from 'ui/shared/nft/NftMedia';
import TokenLogo from 'ui/shared/TokenLogo';
import TruncatedTextTooltip from 'ui/shared/TruncatedTextTooltip';

type Props = AddressTokenBalance;

const NFTItem = ({ token, token_id: tokenId, token_instance: tokenInstance }: Props) => {
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
      <LinkOverlay href={ tokenLink }>
        <NftMedia
          mb="18px"
          imageUrl={ tokenInstance?.image_url || null }
          animationUrl={ tokenInstance?.animation_url || null }
        />
      </LinkOverlay>
      { tokenId && (
        <Flex mb={ 2 } ml={ 1 }>
          <Text whiteSpace="pre" variant="secondary">ID# </Text>
          <TruncatedTextTooltip label={ tokenId }>
            <Link
              overflow="hidden"
              whiteSpace="nowrap"
              textOverflow="ellipsis"
              href={ route({ pathname: '/token/[hash]/instance/[id]', query: { hash: token.address, id: tokenId } }) }
            >
              { tokenId }
            </Link>
          </TruncatedTextTooltip>
        </Flex>
      ) }
      { token.name && (
        <Flex alignItems="center">
          <TokenLogo hash={ token.address } name={ token.name } boxSize={ 6 } ml={ 1 } mr={ 1 }/>
          <TruncatedTextTooltip label={ token.name }>
            <Text variant="secondary" overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">{ token.name }</Text>
          </TruncatedTextTooltip>
        </Flex>
      ) }
    </LinkBox>
  );
};

export default NFTItem;
