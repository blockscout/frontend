import { chakra } from '@chakra-ui/react';
import React from 'react';

import type { EntityTag as TEntityTag } from './types';

import { route } from 'nextjs-routes';

import type { Props as TagProps } from 'ui/shared/chakra/Tag';
import Tag from 'ui/shared/chakra/Tag';
import TruncatedValue from 'ui/shared/TruncatedValue';

import IconSvg from '../IconSvg';
import LinkExternal from '../LinkExternal';
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
    bg: data.meta?.bgColor,
    color: data.meta?.textColor,
  };

  switch (data.tagType) {
    case 'generic':
    case 'protocol': {
      return (
        <Tag { ...tagProps } colorScheme="gray-blue">
          <chakra.span color="gray.400"># </chakra.span>
          <LinkInternal href={ route({ pathname: '/' }) } color="inherit">
            { data.name }
          </LinkInternal>
        </Tag>
      );
    }
    case 'name': {
      const icon = <IconSvg name="publictags_slim" boxSize={ 3 } mr={ 1 } flexShrink={ 0 }/>;

      if (data.meta?.actionURL) {
        return (
          <Tag { ...tagProps } colorScheme="gray-blue" display="flex" alignItems="center" minW={ 0 }>
            { icon }
            <LinkExternal href={ data.meta.actionURL } display="inline-flex" overflow="hidden" color="inherit">
              <TruncatedValue value={ data.name }/>
            </LinkExternal>
          </Tag>
        );
      }

      return (
        <Tag { ...tagProps }>
          { icon }
          { data.name }
        </Tag>
      );
    }
    case 'classifier':
    case 'information': {
      if (data.meta?.actionURL) {
        return (
          <Tag { ...tagProps } colorScheme="gray-blue">
            <LinkExternal href={ data.meta.actionURL } color="inherit">
              { data.name }
            </LinkExternal>
          </Tag>
        );
      }
    }
  }

  return (
    <Tag { ...tagProps } >
      { data.name }
    </Tag>
  );
};

export default React.memo(EntityTag);
