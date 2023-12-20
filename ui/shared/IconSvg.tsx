import { Skeleton, chakra } from '@chakra-ui/react';
import { type IconName } from 'public/icons/name';
import React from 'react';

export const href = '/icons/sprite.svg';

export { IconName };

interface Props {
  name: IconName;
  isLoading?: boolean;
  className?: string;
}

const IconSvg = ({ name, isLoading, className }: Props) => {
  return (
    <Skeleton isLoaded={ !isLoading } className={ className }>
      <chakra.svg w="100%" h="100%">
        <use href={ `${ href }#${ name }` }/>
      </chakra.svg>
    </Skeleton>
  );
};

export default chakra(IconSvg);
