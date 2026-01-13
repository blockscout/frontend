import type { JsxStyleProps } from '@chakra-ui/react';
import React from 'react';

import type { ExternalChain } from 'types/externalChains';

import config from 'configs/app';

import type { EntityProps as TxEntityProps } from './TxEntity';
import TxEntity from './TxEntity';
import TxEntityExternal from './TxEntityExternal';

interface Props extends TxEntityProps, JsxStyleProps {
  chains: Array<ExternalChain> | undefined;
  chainId: string;
}

const TxEntityInterchain = ({ chains, chainId, ...props }: Props) => {

  const isCurrentChain = chainId === config.chain.id;
  const chain = chains?.find((chain) => chain.id === chainId);

  if (isCurrentChain) {
    return <TxEntity { ...props } chain={ chain }/>;
  }

  return <TxEntityExternal { ...props } chain={ chain }/>;
};

export default React.memo(TxEntityInterchain);
