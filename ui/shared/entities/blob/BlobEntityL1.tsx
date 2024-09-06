import { chakra } from '@chakra-ui/react';
import _omit from 'lodash/omit';
import React from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';

import * as BlobEntity from './BlobEntity';

const rollupFeature = config.features.rollup;

const BlobEntityL1 = (props: BlobEntity.EntityProps) => {
  const partsProps = _omit(props, [ 'className', 'onClick' ]);
  const linkProps = _omit(props, [ 'className' ]);

  if (!rollupFeature.isEnabled) {
    return null;
  }

  return (
    <BlobEntity.Container className={ props.className }>
      <BlobEntity.Icon { ...partsProps }/>
      <BlobEntity.Link
        { ...linkProps }
        isExternal
        href={ rollupFeature.L1BaseUrl + route({ pathname: '/blobs/[hash]', query: { hash: props.hash } }) }
      >
        <BlobEntity.Content { ...partsProps }/>
      </BlobEntity.Link>
      <BlobEntity.Copy { ...partsProps }/>
    </BlobEntity.Container>
  );
};

export default chakra(BlobEntityL1);
