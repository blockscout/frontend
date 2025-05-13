import { chakra } from '@chakra-ui/react';
import React from 'react';

import type { EntityTag } from './types';

import { Image } from 'toolkit/chakra/image';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  data: EntityTag;
  ignoreColor?: boolean;
}

const EntityTagIcon = ({ data, ignoreColor }: Props) => {

  const iconColor = data.meta?.textColor && !ignoreColor ? data.meta.textColor : 'gray.400';

  if (data.meta?.tagIcon) {
    return <Image boxSize={ 3 } src={ data.meta.tagIcon } alt={ `${ data.name } icon` }/>;
  }

  if (data.tagType === 'name') {
    return <IconSvg name="publictags_slim" boxSize={ 3 } color={ iconColor }/>;
  }

  if (data.tagType === 'protocol' || data.tagType === 'generic') {
    return <chakra.span color={ iconColor }>#</chakra.span>;
  }

  return null;
};

export default React.memo(EntityTagIcon);
