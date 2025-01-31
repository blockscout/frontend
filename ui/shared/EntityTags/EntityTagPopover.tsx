import { chakra, Image, Flex, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, useColorModeValue, DarkMode } from '@chakra-ui/react';
import React from 'react';

import type { EntityTag } from './types';

import makePrettyLink from 'lib/makePrettyLink';
import * as mixpanel from 'lib/mixpanel/index';
import Popover from 'ui/shared/chakra/Popover';
import LinkExternal from 'ui/shared/links/LinkExternal';

interface Props {
  data: EntityTag;
  children: React.ReactNode;
}

const EntityTagPopover = ({ data, children }: Props) => {
  const bgColor = useColorModeValue('gray.700', 'gray.900');
  const link = makePrettyLink(data.meta?.tooltipUrl);
  const hasPopover = Boolean(data.meta?.tooltipIcon || data.meta?.tooltipTitle || data.meta?.tooltipDescription || data.meta?.tooltipUrl);

  const handleLinkClick = React.useCallback(() => {
    if (!data.meta?.tooltipUrl) {
      return;
    }

    mixpanel.logEvent(mixpanel.EventTypes.PAGE_WIDGET, {
      Type: 'Address tag',
      Info: data.slug,
      URL: data.meta.tooltipUrl,
    });
  }, [ data.meta?.tooltipUrl, data.slug ]);

  if (!hasPopover) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{ children }</>;
  }

  return (
    <Popover trigger="hover" isLazy gutter={ 8 }>
      <PopoverTrigger>
        { children }
      </PopoverTrigger>
      <PopoverContent bgColor={ bgColor } borderRadius="sm" maxW="280px" w="fit-content">
        <PopoverArrow bgColor={ bgColor }/>
        <DarkMode>
          <PopoverBody color="white" p={ 2 } fontSize="sm" display="flex" flexDir="column" rowGap={ 2 }>
            { (data.meta?.tooltipIcon || data.meta?.tooltipTitle) && (
              <Flex columnGap={ 3 } alignItems="center">
                { data.meta?.tooltipIcon && <Image src={ data.meta.tooltipIcon } boxSize="30px" alt={ `${ data.name } tag logo` }/> }
                { data.meta?.tooltipTitle && <chakra.span fontWeight="600">{ data.meta.tooltipTitle }</chakra.span> }
              </Flex>
            ) }
            { data.meta?.tooltipDescription && <chakra.span>{ data.meta.tooltipDescription }</chakra.span> }
            { link && <LinkExternal href={ link.url } onClick={ handleLinkClick }>{ link.domain }</LinkExternal> }
          </PopoverBody>
        </DarkMode>
      </PopoverContent>
    </Popover>
  );
};

export default React.memo(EntityTagPopover);
