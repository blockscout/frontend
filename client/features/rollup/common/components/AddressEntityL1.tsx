// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import config from 'client/config';
import React from 'react';

import { route } from 'nextjs-routes';

import * as AddressEntity from 'client/slices/address/components/entity/AddressEntity';

const rollupFeature = config.features.rollup;

const AddressEntityL1 = (props: AddressEntity.EntityProps) => {
  if (!rollupFeature.isEnabled) {
    return null;
  }

  const defaultHref = rollupFeature.parentChain.baseUrl + route({
    pathname: '/address/[hash]',
    query: {
      ...props.query,
      hash: props.address.hash,
    },
  });

  return (
    <AddressEntity.default { ...props } href={ props.href ?? defaultHref } link={{ external: true }}/>
  );
};

export default chakra(AddressEntityL1);
