import { Box, chakra, Flex, Image, Tooltip, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { ChainInfo } from 'types/api/interop';

import { route } from 'nextjs-routes';

import IconSvg from 'ui/shared/IconSvg';

import { distributeEntityProps } from '../base/utils';
import * as AddressEntity from './AddressEntity';
interface Props extends AddressEntity.EntityProps {
  chain: ChainInfo | null;
}

const IconStub = () => {
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  return (
    <Flex
      position="absolute"
      bottom="-2px"
      right="4px"
      alignItems="center"
      justifyContent="center"
      borderRadius="base"
      background={ bgColor }
      width="14px"
      height="14px"
      border="1px solid"
      borderColor="background"
    >
      <IconSvg
        name="networks/icon-placeholder"
        width="10px"
        height="10px"
        color="text_secondary"
      />
    </Flex>
  );
};

const AddressEntryInterop = (props: Props) => {
  const partsProps = distributeEntityProps(props);

  const href = props.chain?.instance_url ? props.chain.instance_url.replace(/\/$/, '') + route({
    pathname: '/address/[hash]',
    query: {
      ...props.query,
      hash: props.address.hash,
    },
  }) : null;

  const addressIcon = (
    <Box position="relative">
      <AddressEntity.Icon { ...partsProps.icon }/>
      { !props.isLoading && (
        props.chain?.chain_logo ? (
          <Image
            position="absolute"
            bottom="-3px"
            right="4px"
            src={ props.chain.chain_logo }
            alt={ props.chain.chain_name || 'external chain logo' }
            width="14px"
            height="14px"
            borderRadius="base"
          />
        ) : (
          <IconStub/>
        )
      ) }
    </Box>
  );

  return (
    <AddressEntity.Container>
      { props.chain && (
        <Tooltip label={ `Address on ${ props.chain.chain_name ? props.chain.chain_name : 'external chain' } (chain id ${ props.chain.chain_id })` }>
          { addressIcon }
        </Tooltip>
      ) }
      { !props.chain && addressIcon }
      { href ? (
        <AddressEntity.Link { ...partsProps.link } href={ href } isExternal>
          <AddressEntity.Content { ...partsProps.content }/>
        </AddressEntity.Link>
      ) : (
        <AddressEntity.Content { ...partsProps.content }/>
      ) }
      <AddressEntity.Copy { ...partsProps.copy }/>
    </AddressEntity.Container>
  );
};

export default chakra(AddressEntryInterop);
