// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { ExternalChain } from 'src/shared/external-chains/types';

import { isLinkableChain } from 'src/shared/entities/interchain';

import type { EntityProps } from './TxEntity';
import TxEntity from './TxEntity';

interface Props extends Omit<EntityProps, 'chain'> {
  chain: ExternalChain | undefined;
}

const TxEntityInterchain = (props: Props) => {
  const noLink = props.noLink || (!props.href && !isLinkableChain(props.chain)) || undefined;

  return <TxEntity { ...props } noLink={ noLink }/>;
};

export default React.memo(TxEntityInterchain);
