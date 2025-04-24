import { chakra, Flex } from '@chakra-ui/react';
import React from 'react';

import type { EntityTag } from './types';

import * as mixpanel from 'lib/mixpanel/index';
import { Image } from 'toolkit/chakra/image';
import { Link } from 'toolkit/chakra/link';
import { Tooltip } from 'toolkit/chakra/tooltip';
import { makePrettyLink } from 'toolkit/utils/url';

interface Props {
  data: EntityTag;
  children: React.ReactNode;
}

const EntityTagTooltip = ({ data, children }: Props) => {
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

  const content = (
    <Flex textStyle="sm" flexDir="column" rowGap={ 2 } textAlign="left" className="dark">
      { (data.meta?.tooltipIcon || data.meta?.tooltipTitle) && (
        <Flex columnGap={ 3 } alignItems="center">
          { data.meta?.tooltipIcon && <Image src={ data.meta.tooltipIcon } boxSize="30px" alt={ `${ data.name } tag logo` }/> }
          { data.meta?.tooltipTitle && <chakra.span fontWeight="600">{ data.meta.tooltipTitle }</chakra.span> }
        </Flex>
      ) }
      { data.meta?.tooltipDescription && <chakra.span>{ data.meta.tooltipDescription }</chakra.span> }
      { link && <Link external href={ link.href } onClick={ handleLinkClick }>{ link.domain }</Link> }
    </Flex>
  );

  return (
    <Tooltip content={ content } interactive>
      { children }
    </Tooltip>
  );
};

export default React.memo(EntityTagTooltip);
