// SPDX-License-Identifier: LicenseRef-Blockscout

import type { JsxStyleProps } from '@chakra-ui/react';
import React from 'react';

import type { ExternalChain } from 'src/shared/external-chains/types';

import multichainConfig from 'src/features/multichain/chains-config';

import config from 'src/config';

import type { EntityProps as TxEntityProps } from './TxEntity';
import TxEntity from './TxEntity';
import TxEntityExternal from './TxEntityExternal';

interface Props extends TxEntityProps, JsxStyleProps {
  chain: ExternalChain | undefined;
}

const TxEntityInterchain = ({ chain, ...props }: Props) => {

  const isCurrentChain = chain?.id === config.chain.id;
  const multichainChainInfo = multichainConfig()?.chains.find(({ id }) => id === chain?.id);

  if (isCurrentChain || multichainChainInfo) {
    return <TxEntity { ...props } chain={ multichainConfig() ? multichainChainInfo : chain }/>;
  }

  return <TxEntityExternal { ...props } chain={ chain }/>;
};

export default React.memo(TxEntityInterchain);
