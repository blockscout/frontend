import { chakra } from '@chakra-ui/react';
import _omit from 'lodash/omit';
import React from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';

import * as BlockEntity from './BlockEntity';

const feature = config.features.rollup;

const BlockEntityL2 = (props: BlockEntity.EntityProps) => {
  const partsProps = _omit(props, [ 'className', 'onClick' ]);

  if (!feature.isEnabled) {
    return null;
  }

  return (
    <BlockEntity.Link
      { ...props }
      isExternal
      href={ feature.L1BaseUrl + route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: props.hash ?? String(props.number) } }) }
    >
      <BlockEntity.Icon { ...partsProps }/>
      <BlockEntity.Content { ...partsProps }/>
    </BlockEntity.Link>
  );
};

export default chakra(BlockEntityL2);
