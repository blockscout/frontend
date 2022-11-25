import { LinkOverlay } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import link from 'lib/link/link';

type Props = {
  id: string;
  url: string;
  external: boolean;
  title: string;
}

const AppLink = ({ url, external, id, title }: Props) => {
  return external ? (
    <LinkOverlay href={ url } isExternal={ true }>
      { title }
    </LinkOverlay>
  ) : (
    <NextLink href={ link('app_index', { id: id }) } passHref>
      <LinkOverlay>
        { title }
      </LinkOverlay>
    </NextLink>
  );
};

export default AppLink;
