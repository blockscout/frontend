import type { HTMLChakraProps } from '@chakra-ui/react';
import { Skeleton, chakra } from '@chakra-ui/react';
import { type IconName } from 'public/icons/name';
import React from 'react';

export const href = '/icons/sprite.svg';

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
