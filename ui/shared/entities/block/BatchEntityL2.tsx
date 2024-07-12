import { chakra } from '@chakra-ui/react';
import { omit } from 'es-toolkit';
import React from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';

import * as BlockEntity from './BlockEntity';

const rollupFeature = config.features.rollup;

const BatchEntityL2 = (props: BlockEntity.EntityProps) => {
  const linkProps = omit(props, [ 'className' ]);
  const partsProps = omit(props, [ 'className', 'onClick' ]);

  if (!rollupFeature.isEnabled) {
    return null;
  }

  return (
    <BlockEntity.Container className={ props.className }>
      <BlockEntity.Icon { ...partsProps } name="txn_batches_slim"/>
      <BlockEntity.Link
        { ...linkProps }
        href={ route({ pathname: '/batches/[number]', query: { number: props.number.toString() } }) }
      >
        <BlockEntity.Content { ...partsProps }/>
      </BlockEntity.Link>
    </BlockEntity.Container>
  );
};

export default chakra(BatchEntityL2);
