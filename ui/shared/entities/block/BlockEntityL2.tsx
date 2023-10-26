import { chakra } from '@chakra-ui/react';
import _omit from 'lodash/omit';
import React from 'react';

import config from 'configs/app';
import txBatchIcon from 'icons/txn_batches_slim.svg';

import * as BlockEntity from './BlockEntity';

const feature = config.features.optimisticRollup;

const BlockEntityL2 = (props: BlockEntity.EntityProps) => {
  const linkProps = _omit(props, [ 'className' ]);
  const partsProps = _omit(props, [ 'className', 'onClick' ]);

  if (!feature.isEnabled) {
    return null;
  }

  return (
    <BlockEntity.Container className={ props.className }>
      <BlockEntity.Icon { ...partsProps } asProp={ txBatchIcon }/>
      <BlockEntity.Link { ...linkProps }>
        <BlockEntity.Content { ...partsProps }/>
      </BlockEntity.Link>
    </BlockEntity.Container>
  );
};

export default chakra(BlockEntityL2);
