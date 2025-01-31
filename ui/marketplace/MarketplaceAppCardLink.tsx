import { LinkOverlay, chakra } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import type { MouseEvent } from 'react';

type Props = {
  id: string;
  url: string;
  external?: boolean;
  title: string;
  onClick?: (event: MouseEvent, id: string) => void;
  className?: string;
};

const MarketplaceAppCardLink = ({ url, external, id, title, onClick, className }: Props) => {
  const handleClick = React.useCallback((event: MouseEvent) => {
    onClick?.(event, id);
  }, [ onClick, id ]);

  return external ? (
    <LinkOverlay href={ url } isExternal={ true } marginRight={ 2 } className={ className }>
      { title }
    </LinkOverlay>
  ) : (
    <NextLink href={{ pathname: '/apps/[id]', query: { id } }} passHref legacyBehavior>
      <LinkOverlay onClick={ handleClick } marginRight={ 2 } className={ className }>
        { title }
      </LinkOverlay>
    </NextLink>
  );
};

export default chakra(MarketplaceAppCardLink);
