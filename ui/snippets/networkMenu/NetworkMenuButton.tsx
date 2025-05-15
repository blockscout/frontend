import { chakra } from '@chakra-ui/react';
import React from 'react';

import { IconButton } from 'toolkit/chakra/icon-button';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

const NetworkMenuButton = ({ isActive, onClick, className, ...rest }: Props, ref: React.ForwardedRef<HTMLButtonElement>) => {
  return (
    <IconButton
      className={ className }
      display="inline-flex"
      alignItems="center"
      ref={ ref }
      boxSize={ 9 }
      borderRadius="base"
      backgroundColor={ isActive ? { _light: 'blue.50', _dark: 'gray.800' } : 'transparent' }
      onClick={ onClick }
      aria-label="Network menu"
      aria-roledescription="menu"
      { ...rest }
    >
      <IconSvg
        name="networks"
        boxSize={ 4 }
        color={ isActive ? { _light: 'blue.700', _dark: 'blue.50' } : { _light: 'gray.600', _dark: 'gray.400' } }
        _hover={{ color: 'link.primary.hover' }}
        cursor="pointer"
      />
    </IconButton>
  );
};

export default chakra(React.forwardRef(NetworkMenuButton));
