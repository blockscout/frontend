// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import * as TokenEntity from 'client/slices/token/components/entity/TokenEntity';

import config from 'configs/app';

const rollupFeature = config.features.rollup;

const TokenEntityL1 = (props: TokenEntity.EntityProps) => {
  if (!rollupFeature.isEnabled) {
    return null;
  }

  const defaultHref = rollupFeature.parentChain.baseUrl + route({
    pathname: '/token/[hash]',
    query: { hash: props.token.address_hash },
  });

  return (
    <TokenEntity.default { ...props } href={ props.href ?? defaultHref } link={{ external: true }}/>
  );
};

export default chakra(TokenEntityL1);
