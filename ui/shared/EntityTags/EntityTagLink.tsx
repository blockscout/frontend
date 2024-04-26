import type { LinkProps } from '@chakra-ui/react';
import React from 'react';

import type { EntityTag } from './types';

import { route } from 'nextjs-routes';

import LinkExternal from 'ui/shared/LinkExternal';
import LinkInternal from 'ui/shared/LinkInternal';

interface Props {
  data: EntityTag;
  children: React.ReactNode;
}

const EntityTagLink = ({ data, children }: Props) => {
  const linkProps: LinkProps = {
    color: 'inherit',
    display: 'inline-flex',
    overflow: 'hidden',
    _hover: { textDecor: 'none', color: 'inherit' },
  };

  switch (data.tagType) {
    case 'generic':
    case 'protocol': {
      return (
        <LinkInternal
          { ...linkProps }
          href={ route({ pathname: '/' }) }
        >
          { children }
        </LinkInternal>
      );
    }
  }

  if (data.meta?.actionURL) {
    return (
      <LinkExternal
        { ...linkProps }
        href={ data.meta.actionURL }
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
