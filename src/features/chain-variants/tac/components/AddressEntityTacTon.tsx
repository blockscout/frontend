// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import * as tac from '@blockscout/tac-operation-lifecycle-types';

import * as AddressEntity from 'src/slices/address/components/entity/AddressEntity';

import config from 'src/config';

const tacFeature = config.features.tac;

interface Props extends AddressEntity.EntityProps {
  chainType: tac.V2BlockchainType | null;
}

const AddressEntityTacTon = (props: Props) => {
  if (!tacFeature.isEnabled) {
    return null;
  }

  const href = (() => {
    switch (props.chainType) {
      case tac.V2BlockchainType.TON:
        return tacFeature.tonExplorerUrl + route({
          pathname: '/address/[hash]',
          query: {
            ...props.query,
            hash: encodeURIComponent(props.address.hash),
          },
        });
      case tac.V2BlockchainType.TAC:
        return route({
          pathname: '/address/[hash]',
          query: {
            ...props.query,
            hash: props.address.hash,
          },
        });
      default:
        return null;
    }
  })();

  if (!href) {
    return null;
  }

  return (
    <AddressEntity.default
      { ...props }
      href={ href }
      link={{ external: props.chainType === tac.V2BlockchainType.TON }}
      icon={ props.chainType === tac.V2BlockchainType.TON ? {
        shield: { name: 'brands/ton' },
        hint: 'Address on TON',
        hintPostfix: ' on TON',
      } : undefined }
    />
  );
};

export default chakra(AddressEntityTacTon);
