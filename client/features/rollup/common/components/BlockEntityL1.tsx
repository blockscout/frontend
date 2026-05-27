// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import config from 'client/config';
import React from 'react';

import { route } from 'nextjs-routes';

import * as BlockEntity from 'client/slices/block/components/entity/BlockEntity';

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
