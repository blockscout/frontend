import { chakra } from '@chakra-ui/react';
import React from 'react';

import type { ExternalChain } from 'types/externalChains';

import config from 'configs/app';

import type { EntityProps as TxEntityProps } from './TxEntity';
import TxEntity from './TxEntity';
import TxEntityExternal from './TxEntityExternal';

interface Props extends TxEntityProps {
  chains: Array<ExternalChain> | undefined;
  chainId: string;
}

const TxEntityInterchain = ({ chains, chainId, ...props }: Props) => {

  const isCurrentChain = chainId === config.chain.id;

  if (isCurrentChain) {
    return <TxEntity { ...props }/>;
  }

  return <TxEntityExternal { ...props } chain={ chains?.find((chain) => chain.id === chainId) }/>;
};

export default chakra(TxEntityInterchain);
