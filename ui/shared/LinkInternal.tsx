import type { LinkProps } from '@chakra-ui/react';
import { Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

// NOTE! use this component only for links to pages that are completely implemented in new UI
const LinkInternal = (props: LinkProps) => {
  if (!props.href) {
    return <Link { ...props }/>;
  }

  return (
    <NextLink href={ props.href } passHref target={ props.target }>
      <Link { ...props }/>
    </NextLink>
  );
};

export default React.memo(LinkInternal);
