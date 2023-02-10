import { Flex, Link, Text, LinkBox, LinkOverlay, useColorModeValue, Hide } from '@chakra-ui/react';
import React from 'react';

import type { TokenInstance } from 'types/api/token';

import link from 'lib/link/link';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import NftMedia from 'ui/shared/nft/NftMedia';
import TruncatedTextTooltip from 'ui/shared/TruncatedTextTooltip';

type Props = { item: TokenInstance };

const NFTItem = ({ item }: Props) => {
  const tokenLink = link('token_instance_item', { hash: item.token.address, id: item.id });

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
          imageUrl={ item.image_url }
          animationUrl={ item.animation_url }
        />
      </LinkOverlay>
      { item.id && (
        <Flex mb={ 2 } ml={ 1 }>
          <Text whiteSpace="pre" variant="secondary">ID# </Text>
          <TruncatedTextTooltip label={ item.id }>
            <Link
              overflow="hidden"
              whiteSpace="nowrap"
              textOverflow="ellipsis"
            >
              { item.id }
            </Link>
          </TruncatedTextTooltip>
        </Flex>
      ) }
      { item.owner && (
        <Flex mb={ 2 } ml={ 1 }>
          <Text whiteSpace="pre" variant="secondary" mr={ 2 } lineHeight="24px">Owner</Text>
          <Address>
            <Hide below="lg" ssr={ false }><AddressIcon address={ item.owner } mr={ 1 }/></Hide>
            <AddressLink hash={ item.owner.hash } alias={ item.owner.name } type="address" truncation="constant"/>
          </Address>
        </Flex>
      ) }
    </LinkBox>
  );
};

export default NFTItem;
