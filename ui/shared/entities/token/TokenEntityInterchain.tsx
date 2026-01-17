import type { JsxStyleProps } from '@chakra-ui/react';
import React from 'react';

import type { ExternalChain } from 'types/externalChains';

import config from 'configs/app';

import type { EntityProps } from './TokenEntity';
import TokenEntity from './TokenEntity';
import TokenEntityExternal from './TokenEntityExternal';

interface Props extends EntityProps, JsxStyleProps {
  chains: Array<ExternalChain> | undefined;
  chainId: string;
}

const TokenEntityInterchain = ({ chains, chainId, ...props }: Props) => {

  const isCurrentChain = chainId === config.chain.id;

  if (isCurrentChain) {
    return <TokenEntity { ...props }/>;
  }

  return <TokenEntityExternal { ...props } chain={ chains?.find((chain) => chain.id === chainId) }/>;
};

export default React.memo(TokenEntityInterchain);
