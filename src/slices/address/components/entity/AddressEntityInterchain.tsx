// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { ExternalChain } from 'src/shared/external-chains/types';

import { isClusterChain, isCurrentChain, isLinkableChain } from 'src/shared/entities/interchain';

import type { EntityProps } from './AddressEntity';
import AddressEntity from './AddressEntity';

interface Props extends Omit<EntityProps, 'chain'> {
  chain: ExternalChain | undefined;
  currentAddress?: string;
}

// A multichain deployment has no per-chain address page, only the aggregated one, so a cluster chain
// gets neither the chain-scoped link nor the shield and hint.
export const toAddressChain = (chain: ExternalChain | undefined): ExternalChain | undefined => {
  return isClusterChain(chain) ? undefined : chain;
};

const AddressEntityInterchain = ({ currentAddress, chain, ...props }: Props) => {
  const isLocalChain = isCurrentChain(chain) || isClusterChain(chain);
  const isCurrentAddress = isLocalChain && currentAddress?.toLowerCase() === props.address.hash.toLowerCase();
  const noLink = props.noLink || isCurrentAddress || (!props.href && !isLinkableChain(chain)) || undefined;

  return <AddressEntity { ...props } chain={ toAddressChain(chain) } noLink={ noLink }/>;
};

export default React.memo(AddressEntityInterchain);
