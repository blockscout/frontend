import { Box, Flex, Popover, PopoverBody, PopoverContent, PopoverTrigger, useDisclosure, chakra } from '@chakra-ui/react';
import React from 'react';

import type { EntityTag as TEntityTag } from './types';

import config from 'configs/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import Tag from 'ui/shared/chakra/Tag';

interface Props {
  className?: string;
  tags: Array<TEntityTag>;
  isLoading?: boolean;
}

const EntityTags = ({ tags, className, isLoading }: Props) => {
  const isMobile = useIsMobile();
  const { isOpen, onToggle, onClose } = useDisclosure();

  const metaSuitesPlaceholder = config.features.metasuites.isEnabled ?
    <Box display="none" id="meta-suites__address-tag" data-ready={ !isLoading }/> :
    null;

  if (tags.length === 0) {
    return metaSuitesPlaceholder;
  }

  const content = (() => {
    if (isMobile && tags.length > 2) {
      return (
        <>
          {
            tags
              .slice(0, 2)
              .map((tag) => (
                <Tag
                  key={ tag.slug }
                  isLoading={ isLoading }
                  isTruncated
                  maxW={{ base: '115px', lg: 'initial' }}
                  colorScheme="gray"
                  variant="subtle"
                >
                  { tag.name }
                </Tag>
              ))
          }
          { metaSuitesPlaceholder }
          <Popover isOpen={ isOpen } onClose={ onClose } placement="bottom-start" isLazy>
            <PopoverTrigger>
              <Tag isLoading={ isLoading }onClick={ onToggle }>+{ tags.length - 1 }</Tag>
            </PopoverTrigger>
            <PopoverContent w="240px">
              <PopoverBody >
                <Flex columnGap={ 2 } rowGap={ 2 } flexWrap="wrap">
                  {
                    tags
                      .slice(2)
                      .map((tag) => (
                        <Tag
                          key={ tag.slug }
                          colorScheme="gray"
                          variant="subtle"
                        >
                          { tag.name }
                        </Tag>
                      ))
                  }
                </Flex>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </>
      );
    }

    return (
      <>
        { tags.map((tag) => (
          <Tag
            key={ tag.slug }
            isLoading={ isLoading }
            isTruncated
            maxW={{ base: '115px', lg: 'initial' }}
            colorScheme="gray"
            variant="subtle"
          >
            { tag.name }
          </Tag>
        )) }
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
