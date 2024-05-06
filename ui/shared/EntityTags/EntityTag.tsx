import { chakra, Skeleton, Tag } from '@chakra-ui/react';
import React from 'react';

import type { EntityTag as TEntityTag } from './types';

import IconSvg from 'ui/shared/IconSvg';
import TruncatedValue from 'ui/shared/TruncatedValue';

import EntityTagLink from './EntityTagLink';
import EntityTagPopover from './EntityTagPopover';

interface Props {
  data: TEntityTag;
  isLoading?: boolean;
  truncate?: boolean;
}

const EntityTag = ({ data, isLoading, truncate }: Props) => {

  if (isLoading) {
    return <Skeleton borderRadius="sm" w="100px" h="24px"/>;
  }

  // const hasLink = Boolean(data.meta?.tagUrl || data.tagType === 'generic' || data.tagType === 'protocol');
  // Change the condition when "Tag search" page is ready - issue #1869
  const hasLink = Boolean(data.meta?.tagUrl);
  const iconColor = data.meta?.textColor ?? 'gray.400';

  return (
    <EntityTagPopover data={ data }>
      <Tag
        display="flex"
        alignItems="center"
        minW={ 0 }
        maxW={ truncate ? { base: '125px', lg: '300px' } : undefined }
        bg={ data.meta?.bgColor }
        color={ data.meta?.textColor }
        colorScheme={ hasLink ? 'gray-blue' : 'gray' }
        _hover={ hasLink ? { opacity: 0.76 } : undefined }
      >
        <EntityTagLink data={ data }>
          { data.tagType === 'name' && <IconSvg name="publictags_slim" boxSize={ 3 } mr={ 1 } flexShrink={ 0 } color={ iconColor }/> }
          { (data.tagType === 'protocol' || data.tagType === 'generic') && <chakra.span color={ iconColor } whiteSpace="pre"># </chakra.span> }
          <TruncatedValue value={ data.name } tooltipPlacement="top"/>
        </EntityTagLink>
      </Tag>
    </EntityTagPopover>
  );
};

export default React.memo(EntityTag);
