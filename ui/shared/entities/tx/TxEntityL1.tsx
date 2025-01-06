import { chakra } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';

import * as TxEntity from './TxEntity';

const rollupFeature = config.features.rollup;

const TxEntityL1 = (props: TxEntity.EntityProps) => {
  if (!rollupFeature.isEnabled) {
    return null;
  }

  const defaultHref = rollupFeature.L1BaseUrl + route({
    pathname: '/tx/[hash]',
    query: { hash: props.hash },
  });

  return <TxEntity.default { ...props } href={ props.href ?? defaultHref } isExternal/>;
};

export default chakra(TxEntityL1);
