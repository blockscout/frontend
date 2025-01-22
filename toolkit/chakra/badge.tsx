import type { BadgeProps as ChakraBadgeProps } from '@chakra-ui/react';
import { Badge as ChakraBadge } from '@chakra-ui/react';
import React from 'react';

import { Skeleton } from './skeleton';

export interface BadgeProps extends ChakraBadgeProps {
  loading?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  function Badge(props, ref) {
    const { loading, ...rest } = props;

    return (
      <Skeleton loading={ loading }>
        <ChakraBadge ref={ ref } { ...rest }/>
      </Skeleton>
    );
  });
