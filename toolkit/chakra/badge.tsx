import type { BadgeProps as ChakraBadgeProps } from '@chakra-ui/react';
import { chakra, Badge as ChakraBadge } from '@chakra-ui/react';
import React from 'react';

import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';
import TruncatedTextTooltip from 'ui/shared/TruncatedTextTooltip';

import { Skeleton } from './skeleton';

export interface BadgeProps extends Omit<ChakraBadgeProps, 'colorScheme'> {
  loading?: boolean;
  iconStart?: IconName;
  endElement?: React.ReactNode;
  truncated?: boolean;
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  function Badge(props, ref) {
    const { loading, iconStart, children, asChild = true, truncated = false, endElement, ...rest } = props;

    const child = <chakra.span overflow="hidden" textOverflow="ellipsis">{ children }</chakra.span>;

    const childrenElement = truncated ? (
      <TruncatedTextTooltip label={ children }>
        { child }
      </TruncatedTextTooltip>
    ) : child;

    return (
      <Skeleton loading={ loading } asChild={ asChild } ref={ ref }>
        <ChakraBadge display="inline-flex" alignItems="center" whiteSpace="nowrap" { ...rest }>
          { iconStart && <IconSvg name={ iconStart } boxSize="10px"/> }
          { childrenElement }
          { endElement }
        </ChakraBadge>
      </Skeleton>
    );
  });
