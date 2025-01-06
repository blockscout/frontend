import { chakra } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';

import * as BlobEntity from './BlobEntity';

const rollupFeature = config.features.rollup;

const BlobEntityL1 = (props: BlobEntity.EntityProps) => {
  if (!rollupFeature.isEnabled) {
    return null;
  }

  const defaultHref = rollupFeature.L1BaseUrl + route({
    pathname: '/blobs/[hash]',
    query: { hash: props.hash },
  });

  return (
    <BlobEntity.default { ...props } href={ props.href ?? defaultHref } isExternal/>
  );
};

export default chakra(BlobEntityL1);
