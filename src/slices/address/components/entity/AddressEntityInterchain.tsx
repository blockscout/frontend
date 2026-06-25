// SPDX-License-Identifier: LicenseRef-Blockscout

import type { JsxStyleProps } from '@chakra-ui/react';
import React from 'react';

import type { ExternalChain } from 'src/shared/external-chains/types';

import multichainConfig from 'src/features/multichain/chains-config';

import config from 'src/config';

import type { EntityProps } from './AddressEntity';
import AddressEntity from './AddressEntity';
import AddressEntityExternal from './AddressEntityExternal';

interface Props extends EntityProps, JsxStyleProps {
  chain: ExternalChain | undefined;
  currentAddress?: string;
}

const AddressEntityInterchain = ({ chain, currentAddress, ...props }: Props) => {

  const isCurrentChain = chain?.id === config.chain.id;
  const isCurrentAddress = isCurrentChain && currentAddress?.toLowerCase() === props.address.hash.toLowerCase();
  const isMultichainAddress = multichainConfig()?.chains.some(({ id }) => id === chain?.id);

  if (isCurrentChain || isMultichainAddress) {
    return <AddressEntity { ...props } chain={ isMultichainAddress ? undefined : chain } noLink={ isCurrentAddress }/>;
  }

  return <AddressEntityExternal { ...props } chain={ chain }/>;
};

export default React.memo(AddressEntityInterchain);
