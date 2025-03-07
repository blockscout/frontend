import type { ResponsiveValue } from '@chakra-ui/react';
import { Tag } from '@chakra-ui/react';
import React from 'react';

import type { EntityTag as TEntityTag } from './types';

import Skeleton from 'ui/shared/chakra/Skeleton';
import TruncatedValue from 'ui/shared/TruncatedValue';

import EntityTagIcon from './EntityTagIcon';
import EntityTagLink from './EntityTagLink';
import EntityTagPopover from './EntityTagPopover';
import { getTagLinkParams } from './utils';

interface Props {
  data: TEntityTag;
  isLoading?: boolean;
  maxW?: ResponsiveValue<string>;
  noLink?: boolean;
}

const EntityTag = ({ data, isLoading, maxW, noLink }: Props) => {

  if (isLoading) {
    return <Skeleton borderRadius="sm" w="100px" h="24px"/>;
  }

  const hasLink = !noLink && Boolean(getTagLinkParams(data));

  const name = (() => {
    if (data.meta?.warpcastHandle) {
      return `@${ data.meta.warpcastHandle }`;
    }

    return data.name;
  })();

  return (
    <EntityTagPopover data={ data }>
      <Tag
        display="flex"
        alignItems="center"
        minW={ 0 }
        w="fit-content"
        maxW={ maxW }
        bg={ data.meta?.bgColor }
        color={ data.meta?.textColor }
        colorScheme={ hasLink ? 'gray-blue' : 'gray' }
        _hover={ hasLink ? { opacity: 0.76 } : undefined }
      >
        <EntityTagLink data={ data } noLink={ noLink }>
          <EntityTagIcon data={ data } iconColor={ data.meta?.textColor }/>
          <TruncatedValue value={ name } tooltipPlacement="top"/>
        </EntityTagLink>
      </Tag>
    </EntityTagPopover>
  );
};

export default React.memo(EntityTag);
