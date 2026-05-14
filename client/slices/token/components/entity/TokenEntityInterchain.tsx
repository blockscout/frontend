// SPDX-License-Identifier: LicenseRef-Blockscout

import type { JsxStyleProps } from '@chakra-ui/react';
import React from 'react';

import type { ExternalChain } from 'types/externalChains';

import type { EntityProps } from 'client/slices/token/components/entity/TokenEntity';
import TokenEntity from 'client/slices/token/components/entity/TokenEntity';
import TokenEntityExternal from 'client/slices/token/components/entity/TokenEntityExternal';

import config from 'configs/app';

interface Props extends EntityProps, JsxStyleProps {
  chain: ExternalChain | undefined;
}

const TokenEntityInterchain = ({ chain, ...props }: Props) => {

  const isCurrentChain = chain?.id === config.chain.id;

  if (isCurrentChain) {
    return <TokenEntity { ...props }/>;
  }

  return <TokenEntityExternal { ...props } chain={ chain }/>;
};

export default React.memo(TokenEntityInterchain);
