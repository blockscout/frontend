import { chakra } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';

import * as AddressEntity from './AddressEntity';

const rollupFeature = config.features.rollup;

const AddressEntityL1 = (props: AddressEntity.EntityProps) => {
  if (!rollupFeature.isEnabled) {
    return null;
  }

  const defaultHref = rollupFeature.L1BaseUrl + route({
    pathname: '/address/[hash]',
    query: {
      ...props.query,
      hash: props.address.hash,
    },
  });

  return (
    <AddressEntity.default { ...props } href={ props.href ?? defaultHref } isExternal/>
  );
};

export default chakra(AddressEntityL1);
