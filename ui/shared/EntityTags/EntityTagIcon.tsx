import { chakra, Image } from '@chakra-ui/react';
import React from 'react';

import type { EntityTag as TEntityTag } from './types';

import IconSvg from 'ui/shared/IconSvg';

interface Props {
  data: TEntityTag;
  iconColor?: string;
}

const EntityTagIcon = ({ data, iconColor = 'gray.400' }: Props) => {

  if (data.meta?.tagIcon) {
    return <Image boxSize={ 3 } mr={ 1 } flexShrink={ 0 } src={ data.meta.tagIcon } alt={ `${ data.name } icon` }/>;
  }

  if (data.tagType === 'name') {
    return <IconSvg name="publictags_slim" boxSize={ 3 } mr={ 1 } flexShrink={ 0 } color={ iconColor }/>;
  }

  if (data.tagType === 'protocol' || data.tagType === 'generic') {
    return <chakra.span color={ iconColor } whiteSpace="pre"># </chakra.span>;
  }

  return null;
};

export default React.memo(EntityTagIcon);
