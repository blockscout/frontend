// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import React from 'react';

import * as TxEntity from 'client/slices/tx/components/entity/TxEntity';

import config from 'configs/app';
import { stripTrailingSlash } from 'toolkit/utils/url';

const tacFeature = config.features.tac;

const TxEntityTon = (props: TxEntity.EntityProps) => {
  if (!tacFeature.isEnabled) {
    return null;
  }

  const formattedHash = props.hash.replace(/^0x/, '');
  const defaultHref = `${ stripTrailingSlash(tacFeature.tonExplorerUrl) }/transaction/${ formattedHash }`;

  return <TxEntity.default { ...props } hash={ formattedHash } href={ props.href ?? defaultHref } icon={{ name: 'brands/ton' }} link={{ external: true }}/>;
};

export default chakra(TxEntityTon);
