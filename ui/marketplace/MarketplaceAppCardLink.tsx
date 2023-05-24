import { LinkOverlay } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

type Props = {
  id: string;
  url: string;
  external?: boolean;
  title: string;
}

const MarketplaceAppCardLink = ({ url, external, id, title }: Props) => {
  return external ? (
    <LinkOverlay href={ url } isExternal={ true }>
      { title }
    </LinkOverlay>
  ) : (
    <NextLink href={{ pathname: '/apps/[id]', query: { id } }} passHref legacyBehavior>
      <LinkOverlay>
        { title }
      </LinkOverlay>
    </NextLink>
  );
};

export default MarketplaceAppCardLink;
