// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import * as BlockEntity from 'src/slices/block/components/entity/BlockEntity';

import config from 'src/config';

const rollupFeature = config.features.rollup;

const BlockEntityL1 = (props: BlockEntity.EntityProps) => {
  if (!rollupFeature.isEnabled) {
    return null;
  }

  const defaultHref = rollupFeature.parentChain.baseUrl + route({
    pathname: '/block/[height_or_hash]',
    query: { height_or_hash: props.hash ?? String(props.number) },
  });

  return <BlockEntity.default { ...props } href={ props.href ?? defaultHref } link={{ external: true }}/>;
};

export default chakra(BlockEntityL1);
