import React from 'react';

import type { EntityTag as TEntityTag } from './types';

import { route } from 'nextjs-routes';

import type { Props as TagProps } from 'ui/shared/chakra/Tag';
import Tag from 'ui/shared/chakra/Tag';

import IconSvg from '../IconSvg';
import LinkInternal from '../LinkInternal';

interface Props {
  data: TEntityTag;
  isLoading?: boolean;
  truncate?: boolean;
}

const EntityTag = ({ data, isLoading, truncate }: Props) => {
  const tagProps: TagProps = {
    isLoading,
    isTruncated: truncate,
    maxW: truncate ? { base: '115px', lg: 'initial' } : undefined,
    colorScheme: 'gray',
    variant: 'subtle',
  };

  switch (data.tagType) {
    case 'generic':
    case 'protocol': {
      return (
        <Tag { ...tagProps } >
          <LinkInternal href={ route({ pathname: '/' }) } color="inherit">
            # { data.name }
          </LinkInternal>
        </Tag>
      );
    }
    case 'name': {
      return (
        <Tag { ...tagProps }>
          <IconSvg name="publictags_slim" boxSize={ 3 } mr={ 1 }/>
          { data.name }
        </Tag>
      );
    }
  }

  return (
    <Tag { ...tagProps } >
      { data.name }
    </Tag>
  );
};

export default React.memo(EntityTag);
