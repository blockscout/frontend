import { Box, Image, Tooltip, chakra, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { ChainInfo } from 'types/api/interop';

import { route } from 'nextjs-routes';

import stripTrailingSlash from 'lib/stripTrailingSlash';
import Skeleton from 'ui/shared/chakra/Skeleton';
import IconSvg from 'ui/shared/IconSvg';

import { distributeEntityProps } from '../base/utils';
import * as TxEntity from './TxEntity';

type Props = {
  chain: ChainInfo | null;
  hash?: string | null;
} & Omit<TxEntity.EntityProps, 'hash'>;

const IconStub = ({ isLoading }: { isLoading?: boolean }) => {
  const bgColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');
  return (
    <Skeleton
      isLoaded={ !isLoading }
      display="flex"
      minWidth="20px"
      h="20px"
      borderRadius="full"
      background={ bgColor }
      alignItems="center"
      justifyContent="center"
      mr={ 2 }
    >
      <IconSvg
        name="networks/icon-placeholder"
        width="16px"
        height="16px"
        color="text_secondary"
        display="block"
      />
    </Skeleton>
  );
};

const TxEntityInterop = ({ chain, hash, ...props }: Props) => {
  const partsProps = distributeEntityProps(props);

  const href = (chain?.instance_url && hash) ? stripTrailingSlash(chain.instance_url) + route({
    pathname: '/tx/[hash]',
    query: {
      ...props.query,
      hash: hash,
    },
  }) : null;

  return (
    <TxEntity.Container { ...partsProps.container }>
      { chain && (
        <Tooltip label={ `${ chain.chain_name ? chain.chain_name : 'External chain' } (chain id ${ chain.chain_id })` }>
          <Box>
            { chain.chain_logo ? (
              <Image
                src={ chain.chain_logo }
                alt={ chain.chain_name || 'external chain logo' }
                width="20px"
                height="20px"
                mr={ 2 }
                borderRadius="base"
              />
            ) : (
              <IconStub isLoading={ props.isLoading }/>
            ) }
          </Box>
        </Tooltip>
      ) }
      { !chain && (
        <IconStub/>
      ) }
      { hash && (
        <>
          { href ? (
            <TxEntity.Link { ...partsProps.link } hash={ hash } href={ href } isExternal>
              <TxEntity.Content { ...partsProps.content } hash={ hash }/>
            </TxEntity.Link>
          ) : (
            <TxEntity.Content { ...partsProps.content } hash={ hash }/>
          ) }
          <TxEntity.Copy { ...partsProps.copy } hash={ hash }/>
        </>
      ) }
      { !hash && (
        'N/A'
      ) }
    </TxEntity.Container>
  );
};

export default chakra(TxEntityInterop);
