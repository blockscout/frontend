import { chakra } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';

import * as BlockEntity from './BlockEntity';

const rollupFeature = config.features.rollup;

const BlockEntityL1 = (props: BlockEntity.EntityProps) => {
  if (!rollupFeature.isEnabled) {
    return null;
  }

  const defaultHref = rollupFeature.L1BaseUrl + route({
    pathname: '/block/[height_or_hash]',
    query: { height_or_hash: props.hash ?? String(props.number) },
  });

  return <BlockEntity.default { ...props } href={ props.href ?? defaultHref } isExternal/>;
};

export default chakra(BlockEntityL1);
