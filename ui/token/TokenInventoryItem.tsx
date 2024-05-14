import { Box, Flex, Text, Link, useColorModeValue, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { TokenInfo, TokenInstance } from 'types/api/token';

import { route } from 'nextjs-routes';

import useIsMobile from 'lib/hooks/useIsMobile';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import LinkInternal from 'ui/shared/links/LinkInternal';
import NftMedia from 'ui/shared/nft/NftMedia';
import TruncatedTextTooltip from 'ui/shared/TruncatedTextTooltip';

type Props = { item: TokenInstance; token: TokenInfo; isLoading: boolean };

const TokenInventoryItem = ({ item, token, isLoading }: Props) => {

  const isMobile = useIsMobile();

  const mediaElement = (
    <NftMedia
      mb="18px"
      animationUrl={ item.animation_url }
      imageUrl={ item.image_url }
      isLoading={ isLoading }
      autoplayVideo={ false }
    />
  );

  const url = route({ pathname: '/token/[hash]/instance/[id]', query: { hash: token.address, id: item.id } });

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
      <Link href={ isLoading ? undefined : url }>
        { mediaElement }
      </Link>
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
                href={ url }
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
    </Box>
  );
};

export default TokenInventoryItem;
