import { chakra } from '@chakra-ui/react';
import { omit } from 'es-toolkit';
import React from 'react';

import config from 'configs/app';

import * as BlockEntity from './BlockEntity';

const rollupFeature = config.features.rollup;

const BlockEntityL2 = (props: BlockEntity.EntityProps) => {
  const linkProps = omit(props, [ 'className' ]);
  const partsProps = omit(props, [ 'className', 'onClick' ]);

  if (!rollupFeature.isEnabled) {
    return null;
  }

  return (
    <BlockEntity.Container className={ props.className }>
      <BlockEntity.Icon { ...partsProps } name="txn_batches_slim"/>
      <BlockEntity.Link { ...linkProps }>
        <BlockEntity.Content { ...partsProps }/>
      </BlockEntity.Link>
    </BlockEntity.Container>
  );
};

export default chakra(BlockEntityL2);
