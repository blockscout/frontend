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
  withShield?: boolean;
}

const AddressEntityInterchain = ({ chains, chainId, withShield, ...props }: Props) => {

  const isCurrentChain = chainId === config.chain.id;
  const chain = chains?.find((chain) => chain.id === chainId);

  if (isCurrentChain) {
    return <AddressEntity { ...props } chain={ withShield ? chain : undefined }/>;
  }

  return <AddressEntityExternal { ...props } chain={ chain } withShield={ withShield }/>;
};

export default React.memo(AddressEntityInterchain);
