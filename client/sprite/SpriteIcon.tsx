// SPDX-License-Identifier: LicenseRef-Blockscout

import type { HTMLChakraProps } from '@chakra-ui/react';
import { chakra } from '@chakra-ui/react';
import config from 'client/config';
import { type IconName } from 'public/icons/name';
import React from 'react';

import { Skeleton } from 'toolkit/chakra/skeleton';

export const href = config.app.spriteHash ? `/icons/sprite.${ config.app.spriteHash }.svg` : '/icons/sprite.svg';

export { IconName };

export interface Props extends HTMLChakraProps<'div'> {
  name: IconName;
  isLoading?: boolean;
}

const SpriteIcon = React.forwardRef(
  function SpriteIcon({ name, isLoading = false, ...props }: Props, ref: React.ForwardedRef<HTMLDivElement>) {
    return (
      <Skeleton loading={ isLoading } display="inline-block" flexShrink={ 0 } asChild { ...props } ref={ ref }>
        <chakra.svg w="100%" h="100%">
          <use href={ `${ href }#${ name }` }/>
        </chakra.svg>
      </Skeleton>
    );
  },
);

SpriteIcon.displayName = 'SpriteIcon';

export default SpriteIcon;
