// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import type { ChainInfo } from 'src/features/op-interop/types/api';

import * as AddressEntity from 'src/slices/address/components/entity/AddressEntity';

import { route } from 'src/shared/router/routes';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { Image } from 'src/toolkit/chakra/image';
import { Tooltip } from 'src/toolkit/chakra/tooltip';
import { stripTrailingSlash } from 'src/toolkit/utils/url';

interface Props extends Omit<AddressEntity.EntityProps, 'chain'> {
  chain: ChainInfo | null;
}

const IconStub = () => {
  return (
    <Flex
      position="absolute"
      bottom="-2px"
      right="4px"
      alignItems="center"
      justifyContent="center"
      borderRadius="base"
      background={{ _light: 'gray.100', _dark: 'gray.700' }}
      width="14px"
      height="14px"
      border="1px solid"
      borderColor="bg.primary"
    >
      <SpriteIcon
        name="networks/icon-placeholder"
        width="10px"
        height="10px"
        color="icon.primary"
      />
    </Flex>
  );
};

interface ChainBadgeProps {
  chain: ChainInfo | null;
}

const ChainBadge = ({ chain }: ChainBadgeProps) => {
  if (!chain?.chain_logo) {
    return <IconStub/>;
  }

  return (
    <Image
      position="absolute"
      bottom="-3px"
      right="4px"
      src={ chain.chain_logo }
      alt={ chain.chain_name || 'external chain logo' }
      fallback={ <IconStub/> }
      width="14px"
      height="14px"
      borderRadius="base"
    />
  );
};

const AddressEntityInterop = ({ chain, ...props }: Props) => {
  const href = chain?.instance_url ? stripTrailingSlash(chain.instance_url) + route({
    pathname: '/address/[hash]',
    query: {
      ...props.query,
      hash: props.address.hash,
    },
  }) : undefined;

  const addressIcon = (
    <Box position="relative">
      <AddressEntity.Icon/>
      { !props.isLoading && <ChainBadge chain={ chain }/> }
    </Box>
  );

  return (
    <AddressEntity.Container { ...props }>
      { chain ? (
        <Tooltip content={ `Address on ${ chain.chain_name ? chain.chain_name : 'external chain' } (chain id ${ chain.chain_id })` }>
          { addressIcon }
        </Tooltip>
      ) : addressIcon }
      { href ? (
        <AddressEntity.Link href={ href } external>
          <AddressEntity.Content/>
        </AddressEntity.Link>
      ) : (
        <Box overflow="hidden">
          <AddressEntity.Content/>
        </Box>
      ) }
      <AddressEntity.Copy/>
    </AddressEntity.Container>
  );
};

export default AddressEntityInterop;
