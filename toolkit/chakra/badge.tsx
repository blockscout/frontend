import type { BadgeProps as ChakraBadgeProps } from '@chakra-ui/react';
import { Badge as ChakraBadge } from '@chakra-ui/react';
import React from 'react';

import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';

import { Skeleton } from './skeleton';

export interface BadgeProps extends ChakraBadgeProps {
  loading?: boolean;
  iconStart?: IconName;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  function Badge(props, ref) {
    const { loading, iconStart, children, ...rest } = props;

    return (
      <Skeleton loading={ loading }>
        <ChakraBadge ref={ ref } display="flex" alignItems="center" gap={ 1 } { ...rest }>
          { iconStart && <IconSvg name={ iconStart } boxSize="10px"/> }
          { children }
        </ChakraBadge>
      </Skeleton>
    );
  });
