import { Button } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import link from 'lib/link/link';

type Props = {
  id: string;
  url: string;
  external: boolean;
  title: string;
}

const AppModalLink = ({ url, external, id }: Props) => {
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
    <NextLink href={ link('app_index', { id: id }) } passHref>
      <Button
        as="a"
        { ...buttonProps }
      >Launch app</Button>
    </NextLink>
  );
};

export default AppModalLink;
