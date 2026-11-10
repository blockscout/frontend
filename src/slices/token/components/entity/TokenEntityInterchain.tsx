// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { ExternalChain } from 'src/shared/external-chains/types';

import type { EntityProps } from 'src/slices/token/components/entity/TokenEntity';
import TokenEntity from 'src/slices/token/components/entity/TokenEntity';

import multichainConfig from 'src/features/multichain/chains-config';

import { isClusterChain, isCurrentChain, isLinkableChain } from 'src/shared/entities/interchain';
import type { EntityChain } from 'src/shared/entities/resolve-entity-link';

interface Props extends Omit<EntityProps, 'chain'> {
  chain: ExternalChain | undefined;
}

// A token shows its chain shield only in a multichain deployment; elsewhere a foreign chain is a link out and nothing more.
export const toTokenChain = (chain: ExternalChain | undefined): EntityChain | undefined => {
  if (!chain || (isCurrentChain(chain) && !isClusterChain(chain))) {
    return;
  }

  if (isClusterChain(chain) || multichainConfig()) {
    return chain;
  }

  return { ...chain, linkOnly: true };
};

const TokenEntityInterchain = ({ chain, ...props }: Props) => {
  const noLink = props.noLink || (!props.href && !isLinkableChain(chain)) || undefined;

  return <TokenEntity { ...props } chain={ toTokenChain(chain) } noLink={ noLink }/>;
};

export default React.memo(TokenEntityInterchain);
