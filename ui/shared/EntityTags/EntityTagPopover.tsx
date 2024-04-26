import { chakra, Image, Flex, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { EntityTag } from './types';

import makePrettyLink from 'lib/makePrettyLink';
import LinkExternal from 'ui/shared/LinkExternal';

interface Props {
  data: EntityTag;
  children: React.ReactNode;
}

const EntityTagPopover = ({ data, children }: Props) => {
  const bgColor = useColorModeValue('gray.700', 'gray.900');
  const link = makePrettyLink(data.meta?.tooltipUrl);
  const hasPopover = Boolean(data.meta?.tooltipIcon || data.meta?.tooltipTitle || data.meta?.tooltipDescription || data.meta?.tooltipUrl);

  if (!hasPopover) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{ children }</>;
  }

  return (
    <Popover trigger="hover" isLazy>
      <PopoverTrigger>
        { children }
      </PopoverTrigger>
      <PopoverContent bgColor={ bgColor } borderRadius="sm">
        <PopoverArrow bgColor={ bgColor }/>
        <PopoverBody color="white" p={ 2 } fontSize="sm" display="flex" flexDir="column" rowGap={ 2 }>
          { (data.meta?.tooltipIcon || data.meta?.tooltipTitle) && (
            <Flex columnGap={ 3 } alignItems="center">
              { data.meta?.tooltipIcon && <Image src={ data.meta.tooltipIcon } boxSize="30px" alt={ `${ data.name } tag logo` }/> }
              { data.meta?.tooltipTitle && <chakra.span fontWeight="600">{ data.meta.tooltipTitle }</chakra.span> }
            </Flex>
          ) }
          { data.meta?.tooltipDescription && <chakra.span>{ data.meta.tooltipDescription }</chakra.span> }
          { link && <LinkExternal href={ link.url }>{ link.domain }</LinkExternal> }
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default React.memo(EntityTagPopover);
