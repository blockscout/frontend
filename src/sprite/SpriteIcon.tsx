// SPDX-License-Identifier: LicenseRef-Blockscout

import type { HTMLChakraProps } from '@chakra-ui/react';
import { chakra } from '@chakra-ui/react';
import { type IconName } from 'public/icons/name';
import React from 'react';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

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
          { /* the sprite is injected into the document by SpriteInjector, so the reference is same-document — */ }
          { /* external references re-resolve asynchronously on every remount in WebKit and flicker */ }
          <use href={ `#${ name }` }/>
        </chakra.svg>
      </Skeleton>
    );
  },
);

SpriteIcon.displayName = 'SpriteIcon';

export default SpriteIcon;
