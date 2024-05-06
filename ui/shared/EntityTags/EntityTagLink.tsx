import type { LinkProps } from '@chakra-ui/react';
import React from 'react';

import type { EntityTag } from './types';

import * as mixpanel from 'lib/mixpanel/index';
import LinkExternal from 'ui/shared/LinkExternal';

// import { route } from 'nextjs-routes';
// import LinkInternal from 'ui/shared/LinkInternal';

interface Props {
  data: EntityTag;
  children: React.ReactNode;
}

const EntityTagLink = ({ data, children }: Props) => {

  const handleLinkClick = React.useCallback(() => {
    if (!data.meta?.tagUrl) {
      return;
    }

    mixpanel.logEvent(mixpanel.EventTypes.PAGE_WIDGET, {
      Type: 'Address tag',
      Info: data.slug,
      URL: data.meta.tagUrl,
    });
  }, [ data.meta?.tagUrl, data.slug ]);

  const linkProps: LinkProps = {
    color: 'inherit',
    display: 'inline-flex',
    overflow: 'hidden',
    _hover: { textDecor: 'none', color: 'inherit' },
    onClick: handleLinkClick,
  };

  // Uncomment this block when "Tag search" page is ready - issue #1869
  // switch (data.tagType) {
  //   case 'generic':
  //   case 'protocol': {
  //     return (
  //       <LinkInternal
  //         { ...linkProps }
  //         href={ route({ pathname: '/' }) }
  //       >
  //         { children }
  //       </LinkInternal>
  //     );
  //   }
  // }

  if (data.meta?.tagUrl) {
    return (
      <LinkExternal
        { ...linkProps }
        href={ data.meta.tagUrl }
        iconColor={ data.meta.textColor }
      >
        { children }
      </LinkExternal>
    );
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{ children }</>;
};

export default React.memo(EntityTagLink);
