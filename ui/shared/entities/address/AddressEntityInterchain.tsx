import type { JsxStyleProps } from '@chakra-ui/react';
import React from 'react';

import type { ExternalChain } from 'types/externalChains';

import config from 'configs/app';

import type { EntityProps } from './AddressEntity';
import AddressEntity from './AddressEntity';
import AddressEntityExternal from './AddressEntityExternal';

interface Props extends EntityProps, JsxStyleProps {
  chains: Array<ExternalChain> | undefined;
  chainId: string;
}

const AddressEntityInterchain = ({ chains, chainId, ...props }: Props) => {

  const isCurrentChain = chainId === config.chain.id;
  const chain = chains?.find((chain) => chain.id === chainId);

  if (isCurrentChain) {
    return <AddressEntity { ...props } chain={ chain }/>;
  }

  return <AddressEntityExternal { ...props } chain={ chain }/>;
};

export default React.memo(AddressEntityInterchain);
