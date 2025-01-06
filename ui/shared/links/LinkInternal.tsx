import type { LinkProps, FlexProps } from '@chakra-ui/react';
import { Flex, Link } from '@chakra-ui/react';
import type { LinkProps as NextLinkProps } from 'next/link';
import NextLink from 'next/link';
import type { LegacyRef } from 'react';
import React from 'react';

import type { Variants } from './useLinkStyles';
import { useLinkStyles } from './useLinkStyles';

type Props = LinkProps & {
  variant?: Variants;
  isLoading?: boolean;
  scroll?: boolean;
};

const LinkInternal = ({ isLoading, variant, scroll = true, ...props }: Props, ref: LegacyRef<HTMLAnchorElement>) => {
  const styleProps = useLinkStyles({}, variant);

  if (isLoading) {
    return <Flex alignItems="center" { ...props as FlexProps } { ...styleProps }>{ props.children }</Flex>;
  }

  if (!props.href) {
    return <Link { ...props } ref={ ref } { ...styleProps }/>;
  }

  return (
    <NextLink href={ props.href as NextLinkProps['href'] } passHref target={ props.target } legacyBehavior scroll={ scroll }>
      <Link { ...props } ref={ ref } { ...styleProps }/>
    </NextLink>
  );
};

export default React.memo(React.forwardRef(LinkInternal));
