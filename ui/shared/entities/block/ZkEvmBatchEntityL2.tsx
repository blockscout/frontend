import { chakra } from '@chakra-ui/react';
import _omit from 'lodash/omit';
import React from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import txBatchIcon from 'icons/txn_batches_slim.svg';

import * as BlockEntity from './BlockEntity';

const feature = config.features.zkEvmRollup;

const ZkEvmBatchEntityL2 = (props: BlockEntity.EntityProps) => {
  const linkProps = _omit(props, [ 'className' ]);
  const partsProps = _omit(props, [ 'className', 'onClick' ]);

  if (!feature.isEnabled) {
    return null;
  }

  return (
    <BlockEntity.Container className={ props.className }>
      <BlockEntity.Icon { ...partsProps } asProp={ txBatchIcon }/>
      <BlockEntity.Link
        { ...linkProps }
        href={ route({ pathname: '/zkevm-l2-txn-batch/[number]', query: { number: props.number.toString() } }) }
      >
        <BlockEntity.Content { ...partsProps }/>
      </BlockEntity.Link>
    </BlockEntity.Container>
  );
};

export default chakra(ZkEvmBatchEntityL2);
