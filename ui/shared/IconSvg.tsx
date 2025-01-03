import type { HTMLChakraProps } from '@chakra-ui/react';
import { chakra } from '@chakra-ui/react';
import { type IconName } from 'public/icons/name';
import React from 'react';

import config from 'configs/app';
import Skeleton from 'ui/shared/chakra/Skeleton';

export const href = config.app.spriteHash ? `/icons/sprite.${ config.app.spriteHash }.svg` : '/icons/sprite.svg';

export { IconName };

interface Props extends HTMLChakraProps<'div'> {
  name: IconName;
  isLoading?: boolean;
}

const IconSvg = ({ name, isLoading, ...props }: Props, ref: React.ForwardedRef<HTMLDivElement>) => {
  return (
    <Skeleton isLoaded={ !isLoading } display="inline-block" { ...props } ref={ ref }>
      <chakra.svg w="100%" h="100%">
        <use href={ `${ href }#${ name }` }/>
      </chakra.svg>
    </Skeleton>
  );
};

export default React.forwardRef(IconSvg);
