// SPDX-License-Identifier: LicenseRef-Blockscout

import type { JsxStyleProps } from '@chakra-ui/react';
import React from 'react';

import type { ExternalChain } from 'src/shared/external-chains/types';

import type { EntityProps } from 'src/slices/token/components/entity/TokenEntity';
import TokenEntity from 'src/slices/token/components/entity/TokenEntity';
import TokenEntityExternal from 'src/slices/token/components/entity/TokenEntityExternal';

import multichainConfig from 'src/features/multichain/chains-config';

import config from 'src/config';

interface Props extends EntityProps, JsxStyleProps {
  chain: ExternalChain | undefined;
}

const TokenEntityInterchain = ({ chain, ...props }: Props) => {

  const isCurrentChain = chain?.id === config.chain.id;
  const multichainChainInfo = multichainConfig()?.chains.find(({ id }) => id === chain?.id);

  if (isCurrentChain || multichainChainInfo) {
    return <TokenEntity { ...props } chain={ multichainChainInfo }/>;
  }

  return <TokenEntityExternal { ...props } chain={ chain }/>;
};

export default React.memo(TokenEntityInterchain);
