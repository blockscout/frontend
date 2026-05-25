// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import React from 'react';

import type { MetadataTag } from './types';

import SpriteIcon from 'client/sprite/SpriteIcon';

import { Image } from 'toolkit/chakra/image';

interface Props {
  data: MetadataTag;
  noColors?: boolean;
}

const EntityTagIcon = ({ data, noColors }: Props) => {

  const iconColor = (!noColors && data.meta?.textColor) || 'icon.secondary';

  if (data.meta?.tagIcon && !noColors) {
    return <Image boxSize={ 3 } src={ data.meta.tagIcon } alt={ `${ data.name } icon` }/>;
  }

  if (data.tagType === 'name') {
    return <SpriteIcon name="publictags" boxSize={ 3 } color={ iconColor }/>;
  }

  if (data.tagType === 'protocol' || data.tagType === 'generic') {
    return <chakra.span color={ iconColor }>#</chakra.span>;
  }

  return null;
};

export default React.memo(EntityTagIcon);
