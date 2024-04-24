import React from 'react';

import type { EntityTag as TEntityTag } from './types';

import Tag from 'ui/shared/chakra/Tag';

interface Props {
  data: TEntityTag;
  isLoading?: boolean;
  truncate?: boolean;
}

const EntityTag = ({ data, isLoading, truncate }: Props) => {
  return (
    <Tag
      isLoading={ isLoading }
      isTruncated={ truncate }
      maxW={ truncate ? { base: '115px', lg: 'initial' } : undefined }
      colorScheme="gray"
      variant="subtle"
    >
      { data.name }
    </Tag>
  );
};

export default React.memo(EntityTag);
