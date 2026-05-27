// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import config from 'client/config';
import React from 'react';

import { route } from 'nextjs-routes';

import * as TxEntity from 'client/slices/tx/components/entity/TxEntity';

const rollupFeature = config.features.rollup;

const TxEntityL1 = (props: TxEntity.EntityProps) => {
  if (!rollupFeature.isEnabled) {
    return null;
  }

  const defaultHref = rollupFeature.parentChain.baseUrl + route({
    pathname: '/tx/[hash]',
    query: { hash: props.hash },
  });

  return <TxEntity.default { ...props } href={ props.href ?? defaultHref } link={{ external: true }}/>;
};

export default chakra(TxEntityL1);
