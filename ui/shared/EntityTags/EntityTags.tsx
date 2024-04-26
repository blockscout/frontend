import { Box, Flex, Popover, PopoverBody, PopoverContent, PopoverTrigger, chakra } from '@chakra-ui/react';
import React from 'react';

import type { EntityTag as TEntityTag } from './types';

import config from 'configs/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import Tag from 'ui/shared/chakra/Tag';

import EntityTag from './EntityTag';

interface Props {
  className?: string;
  tags: Array<TEntityTag>;
  isLoading?: boolean;
}

const EntityTags = ({ tags, className, isLoading }: Props) => {
  const isMobile = useIsMobile();
  const visibleNum = isMobile ? 2 : 3;

  const metaSuitesPlaceholder = config.features.metasuites.isEnabled ?
    <Box display="none" id="meta-suites__address-tag" data-ready={ !isLoading }/> :
    null;

  if (tags.length === 0) {
    return metaSuitesPlaceholder;
  }

  const content = (() => {
    if (tags.length > visibleNum) {
      return (
        <>
          { tags.slice(0, visibleNum).map((tag) => <EntityTag key={ tag.slug } data={ tag } isLoading={ isLoading } truncate/>) }
          { metaSuitesPlaceholder }
          <Popover trigger="click" placement="bottom-start" isLazy>
            <PopoverTrigger>
              <Tag isLoading={ isLoading } cursor="pointer" as="button" _hover={{ color: 'link_hovered' }}>
                +{ tags.length - visibleNum }
              </Tag>
            </PopoverTrigger>
            <PopoverContent w="300px">
              <PopoverBody >
                <Flex columnGap={ 2 } rowGap={ 2 } flexWrap="wrap">
                  { tags.slice(visibleNum).map((tag) => <EntityTag key={ tag.slug } data={ tag }/>) }
                </Flex>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </>
      );
    }

    return (
      <>
        { tags.map((tag) => <EntityTag key={ tag.slug } data={ tag } isLoading={ isLoading } truncate/>) }
        { metaSuitesPlaceholder }
      </>
    );
  })();

  return (
    <Flex className={ className } columnGap={ 2 } rowGap={ 2 } flexWrap="wrap" alignItems="center" flexGrow={ 1 }>
      { content }
    </Flex>
  );
};

export default React.memo(chakra(EntityTags));
