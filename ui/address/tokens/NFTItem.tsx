import { Box, Flex, Text, Link, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { AddressTokenBalance } from 'types/api/address';

import { route } from 'nextjs-routes';

import NftEntity from 'ui/shared/entities/nft/NftEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import NftMedia from 'ui/shared/nft/NftMedia';

type Props = AddressTokenBalance & { isLoading: boolean };

const NFTItem = ({ token, token_id: tokenId, token_instance: tokenInstance, isLoading }: Props) => {
  const tokenInstanceLink = tokenId ? route({ pathname: '/token/[hash]/instance/[id]', query: { hash: token.address, id: tokenId } }) : undefined;

  return (
    <Box
      w={{ base: '100%', lg: '210px' }}
      border="1px solid"
      borderColor={ useColorModeValue('blackAlpha.100', 'whiteAlpha.200') }
      borderRadius="12px"
      p="10px"
      fontSize="sm"
      fontWeight={ 500 }
      lineHeight="20px"
    >
      <Link href={ isLoading ? undefined : tokenInstanceLink }>
        <NftMedia
          mb="18px"
          url={ tokenInstance?.animation_url || tokenInstance?.image_url || null }
          isLoading={ isLoading }
        />
      </Link>
      { tokenId && (
        <Flex mb={ 2 } ml={ 1 }>
          <Text whiteSpace="pre" variant="secondary">ID# </Text>
          <NftEntity hash={ token.address } id={ tokenId } isLoading={ isLoading } noIcon/>
        </Flex>
      ) }
      <TokenEntity
        token={ token }
        isLoading={ isLoading }
        noCopy
        noSymbol
      />
    </Box>
  );
};

export default NFTItem;
