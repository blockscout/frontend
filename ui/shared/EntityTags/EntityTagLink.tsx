import React from 'react';

import type { EntityTag } from './types';

import * as mixpanel from 'lib/mixpanel/index';
import LinkExternal from 'ui/shared/links/LinkExternal';
import LinkInternal from 'ui/shared/links/LinkInternal';

import { getTagLinkParams } from './utils';

interface Props {
  data: EntityTag;
  children: React.ReactNode;
  noLink?: boolean;
}

const EntityTagLink = ({ data, children, noLink }: Props) => {

  const linkParams = !noLink ? getTagLinkParams(data) : undefined;

  const handleLinkClick = React.useCallback(() => {
    if (!linkParams?.href) {
      return;
    }

    mixpanel.logEvent(mixpanel.EventTypes.PAGE_WIDGET, {
      Type: 'Address tag',
      Info: data.slug,
      URL: linkParams.href,
    });
  }, [ linkParams?.href, data.slug ]);

  const linkProps = {
    color: 'inherit',
    display: 'inline-flex',
    overflow: 'hidden',
    _hover: { textDecor: 'none', color: 'inherit' },
    onClick: handleLinkClick,
  };

  if (linkParams?.type === 'internal') {
    return (
      <LinkInternal
        { ...linkProps }
        href={ linkParams.href }
      >
        { children }
      </LinkInternal>
    );
  }

  if (linkParams?.type === 'external') {
    return (
      <LinkExternal
        { ...linkProps }
        href={ linkParams.href }
        iconColor={ data.meta?.textColor }
      >
        { children }
      </LinkExternal>
    );
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{ children }</>;
};

export default React.memo(EntityTagLink);
