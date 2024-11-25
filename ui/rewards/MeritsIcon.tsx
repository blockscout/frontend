import { Icon, useColorModeValue, chakra } from '@chakra-ui/react';
import React from 'react';

// This icon doesn't work properly when it is in the sprite
// Probably because of the gradient
// eslint-disable-next-line no-restricted-imports
import meritsIcon from 'icons/merits_colored.svg';

type Props = {
  className?: string;
};

const MeritsIcon = ({ className }: Props) => {
  const shadow = useColorModeValue('drop-shadow(0px 4px 2px rgba(141, 179, 204, 0.25))', 'none');

  return (
    <Icon as={ meritsIcon } className={ className } filter={ shadow }/>
  );
};

export default chakra(MeritsIcon);
