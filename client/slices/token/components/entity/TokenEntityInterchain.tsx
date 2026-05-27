// SPDX-License-Identifier: LicenseRef-Blockscout

import type { JsxStyleProps } from '@chakra-ui/react';
import config from 'client/config';
import React from 'react';

import type { ExternalChain } from 'client/shared/external-chains/types';

import type { EntityProps } from 'client/slices/token/components/entity/TokenEntity';
import TokenEntity from 'client/slices/token/components/entity/TokenEntity';
import TokenEntityExternal from 'client/slices/token/components/entity/TokenEntityExternal';

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
