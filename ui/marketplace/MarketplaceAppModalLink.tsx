import { Button } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

type Props = {
  id: string;
  url: string;
  external?: boolean;
  title: string;
};

const MarketplaceAppModalLink = ({ url, external, id }: Props) => {
  const buttonProps = {
    size: 'sm',
    marginRight: 2,
    width: { base: '100%', sm: 'auto' },
    ...(external ? {
      target: '_blank',
      rel: 'noopener noreferrer',
    } : {}),
  };

  return external ? (
    <Button
      as="a"
      href={ url }
      { ...buttonProps }
    >Launch app</Button>
  ) : (
    <NextLink href={{ pathname: '/apps/[id]', query: { id } }} passHref legacyBehavior>
      <Button
        as="a"
        { ...buttonProps }
      >Launch app</Button>
    </NextLink>
  );
};

export default MarketplaceAppModalLink;
