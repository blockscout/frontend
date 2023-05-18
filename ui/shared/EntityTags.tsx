import { Flex, chakra } from '@chakra-ui/react';
import React from 'react';

import type { UserTags } from 'types/api/addressParams';

import Tag from 'ui/shared/chakra/Tag';

interface TagData {
  label: string;
  display_name: string;
}

interface Props {
  className?: string;
  data?: UserTags;
  isLoading?: boolean;
  tagsBefore?: Array<TagData | undefined>;
  tagsAfter?: Array<TagData | undefined>;
  contentAfter?: React.ReactNode;
}

const EntityTags = ({ className, data, tagsBefore = [], tagsAfter = [], isLoading, contentAfter }: Props) => {
  const tags = [
    ...tagsBefore,
    ...(data?.private_tags || []),
    ...(data?.public_tags || []),
    ...(data?.watchlist_names || []),
    ...tagsAfter,
  ]
    .filter(Boolean)
    .map((tag) => <Tag key={ tag.label } isLoading={ isLoading }>{ tag.display_name }</Tag>);

  if (tags.length === 0) {
    return null;
  }

  return (
    <Flex className={ className } columnGap={ 2 } rowGap={ 2 } flexWrap="wrap" alignItems="center">
      { tags }
      { contentAfter }
    </Flex>
  );
};

export default React.memo(chakra(EntityTags));
