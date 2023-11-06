import { chakra } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';

import * as AddressEntity from './AddressEntity';

const feature = config.features.optimisticRollup;

const AddressEntityL1 = (props: AddressEntity.EntityProps) => {
  if (!feature.isEnabled) {
    return null;
  }

  const defaultHref = feature.L1BaseUrl + route({
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
