import { chakra } from '@chakra-ui/react';
import _omit from 'lodash/omit';
import React from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';

import * as BlockEntity from './BlockEntity';

const rollupFeature = config.features.rollup;

const BlockEntityL1 = (props: BlockEntity.EntityProps) => {
  const linkProps = _omit(props, [ 'className' ]);
  const partsProps = _omit(props, [ 'className', 'onClick' ]);

  if (!rollupFeature.isEnabled) {
    return null;
  }

  return (
    <BlockEntity.Container className={ props.className }>
      <BlockEntity.Icon { ...partsProps }/>
      <BlockEntity.Link
        { ...linkProps }
        isExternal
        href={ rollupFeature.L1BaseUrl + route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: props.hash ?? String(props.number) } }) }
      >
        <BlockEntity.Content { ...partsProps }/>
      </BlockEntity.Link>
    </BlockEntity.Container>
  );
};

export default chakra(BlockEntityL1);
