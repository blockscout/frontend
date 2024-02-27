import { chakra } from '@chakra-ui/react';
import _omit from 'lodash/omit';
import React from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';

import * as TxEntity from './TxEntity';

const rollupFeature = config.features.rollup;

const TxEntityL1 = (props: TxEntity.EntityProps) => {
  const partsProps = _omit(props, [ 'className', 'onClick' ]);
  const linkProps = _omit(props, [ 'className' ]);

  if (!rollupFeature.isEnabled) {
    return null;
  }

  return (
    <TxEntity.Container className={ props.className }>
      <TxEntity.Icon { ...partsProps }/>
      <TxEntity.Link
        { ...linkProps }
        isExternal
        href={ rollupFeature.L1BaseUrl + route({ pathname: '/tx/[hash]', query: { hash: props.hash } }) }
      >
        <TxEntity.Content { ...partsProps }/>
      </TxEntity.Link>
      <TxEntity.Copy { ...partsProps }/>
    </TxEntity.Container>
  );
};

export default chakra(TxEntityL1);
