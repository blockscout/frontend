import { LinkOverlay } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import type { MouseEvent } from 'react';

type Props = {
  id: string;
  url: string;
  external?: boolean;
  title: string;
  onClick?: (event: MouseEvent) => void;
}

const MarketplaceAppCardLink = ({ url, external, id, title, onClick }: Props) => {
  return external ? (
    <LinkOverlay href={ url } isExternal={ true } marginRight={ 2 }>
      { title }
    </LinkOverlay>
  ) : (
    <NextLink href={{ pathname: '/apps/[id]', query: { id } }} passHref legacyBehavior>
      <LinkOverlay onClick={ onClick } marginRight={ 2 }>
        { title }
      </LinkOverlay>
    </NextLink>
  );
};

export default MarketplaceAppCardLink;
