// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import config from 'client/config';
import React from 'react';

import { route } from 'nextjs-routes';

import * as BlockEntity from 'client/slices/block/components/entity/BlockEntity';

const rollupFeature = config.features.rollup;

const BatchEntityL2 = (props: BlockEntity.EntityProps) => {
  if (!rollupFeature.isEnabled) {
    return null;
  }

  const defaultHref = route({ pathname: '/batches/[number]', query: { number: props.number.toString() } });

  return (
    <BlockEntity.default
      { ...props }
      href={ props.href ?? defaultHref }
      icon={{ name: 'txn_batches' }}
    />
  );
};

export default chakra(BatchEntityL2);
