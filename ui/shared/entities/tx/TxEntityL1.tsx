import { chakra } from '@chakra-ui/react';
import _omit from 'lodash/omit';
import React from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';

import * as TxEntity from './TxEntity';

const feature = config.features.rollup;

const TxEntityL1 = (props: TxEntity.EntityProps) => {
  const partsProps = _omit(props, [ 'className', 'onClick' ]);

  if (!feature.isEnabled) {
    return null;
  }

  return (
    <TxEntity.Link
      { ...props }
      isExternal
      href={ feature.L1BaseUrl + route({ pathname: '/tx/[hash]', query: { hash: props.hash } }) }
    >
      <TxEntity.Icon { ...partsProps }/>
      <TxEntity.Content { ...partsProps }/>
    </TxEntity.Link>
  );
};

export default chakra(TxEntityL1);
