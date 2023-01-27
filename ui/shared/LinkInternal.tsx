import type { LinkProps } from '@chakra-ui/react';
import { Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import type { LegacyRef } from 'react';
import React from 'react';

// NOTE! use this component only for links to pages that are completely implemented in new UI
const LinkInternal = (props: LinkProps, ref: LegacyRef<HTMLAnchorElement>) => {
  if (!props.href) {
    return <Link { ...props } ref={ ref }/>;
  }

  return (
    <NextLink href={ props.href } passHref target={ props.target }>
      <Link { ...props } ref={ ref }/>
    </NextLink>
  );
};

export default React.memo(React.forwardRef(LinkInternal));
