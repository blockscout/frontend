// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { ChainInfo } from 'src/features/op-interop/types/api';

import * as TxEntity from 'src/slices/tx/components/entity/TxEntity';

import { route } from 'src/shared/router/routes';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { Image } from 'src/toolkit/chakra/image';
import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { Tooltip } from 'src/toolkit/chakra/tooltip';
import { stripTrailingSlash } from 'src/toolkit/utils/url';

type Props = {
  chain?: ChainInfo | null;
  hash?: string | null;
} & Omit<TxEntity.EntityProps, 'hash' | 'chain'>;

const IconStub = ({ isLoading }: { isLoading?: boolean }) => {
  return (
    <Skeleton
      loading={ isLoading }
      display="flex"
      minWidth="20px"
      h="20px"
      borderRadius="full"
      background={{ _light: 'blackAlpha.100', _dark: 'whiteAlpha.100' }}
      alignItems="center"
      justifyContent="center"
      mr={ 2 }
    >
      <SpriteIcon
        name="networks/icon-placeholder"
        width="16px"
        height="16px"
        color="icon.primary"
        display="block"
      />
    </Skeleton>
  );
};

interface ChainIconProps {
  chain: ChainInfo | null | undefined;
  isLoading?: boolean;
}

const ChainIcon = ({ chain, isLoading }: ChainIconProps) => {
  if (!chain) {
    return <IconStub/>;
  }

  return (
    <Tooltip content={ `${ chain.chain_name ? chain.chain_name : 'External chain' } (chain id ${ chain.chain_id })` }>
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
          <IconStub isLoading={ isLoading }/>
        ) }
      </Box>
    </Tooltip>
  );
};

const TxEntityInterop = ({ chain, hash, ...props }: Props) => {
  const href = (chain?.instance_url && hash) ? stripTrailingSlash(chain.instance_url) + route({
    pathname: '/tx/[hash]',
    query: {
      ...props.query,
      hash: hash,
    },
  }) : undefined;

  return (
    <TxEntity.Container { ...props } hash={ hash ?? undefined }>
      { !props.noIcon && <ChainIcon chain={ chain } isLoading={ props.isLoading }/> }
      { hash && href && (
        <TxEntity.Link href={ href } external>
          <TxEntity.Content/>
        </TxEntity.Link>
      ) }
      { hash && !href && (
        <Box overflow="hidden">
          <TxEntity.Content/>
        </Box>
      ) }
      { !hash && 'N/A' }
    </TxEntity.Container>
  );
};

export default TxEntityInterop;
