import type { JsxStyleProps } from '@chakra-ui/react';
import React from 'react';

import type { ExternalChain } from 'types/externalChains';

import config from 'configs/app';

import type { EntityProps } from './AddressEntity';
import AddressEntity from './AddressEntity';
import AddressEntityExternal from './AddressEntityExternal';

interface Props extends EntityProps, JsxStyleProps {
  chain: ExternalChain | undefined;
}

const AddressEntityInterchain = ({ chain, ...props }: Props) => {

  const isCurrentChain = chain?.id === config.chain.id;

  if (isCurrentChain) {
    return <AddressEntity { ...props } chain={ chain }/>;
  }

  return <AddressEntityExternal { ...props } chain={ chain }/>;
};

export default React.memo(AddressEntityInterchain);
