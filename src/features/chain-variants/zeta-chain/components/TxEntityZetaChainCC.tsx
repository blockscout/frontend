// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import React from 'react';

import * as TxEntity from 'src/slices/tx/components/entity/TxEntity';

import { route } from 'src/shared/router/routes';

const TxEntityZetaChainCC = (props: TxEntity.EntityProps) => {
  const defaultHref = route({ pathname: '/cc/tx/[hash]', query: { hash: props.hash } });

  return <TxEntity.default { ...props } icon={{ name: 'interop' }} href={ props.href ?? defaultHref }/>;
};

export default chakra(TxEntityZetaChainCC);
