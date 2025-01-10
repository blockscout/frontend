import { chakra } from '@chakra-ui/react';
import React from 'react';

import { IconButton } from 'toolkit/chakra/icon-button';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  isMobile?: boolean;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

const NetworkMenuButton = ({ isMobile, isActive, onClick, className }: Props, ref: React.ForwardedRef<HTMLButtonElement>) => {
  return (
    <IconButton
      className={ className }
      visual="plain"
      display="inline-flex"
      alignItems="center"
      ref={ ref }
      h={ 9 }
      borderRadius="base"
      backgroundColor={ isActive ? { _light: 'blue.50', _dark: 'gray.400' } : 'none' }
      onClick={ onClick }
      aria-label="Network menu"
      aria-roledescription="menu"
    >
      <IconSvg
        name="networks"
        boxSize={ 4 }
        color={ isActive ? { _light: 'blue.700', _dark: 'blue.50' } : { _light: 'gray.600', _dark: 'gray.400' } }
        _hover={{ color: isMobile ? undefined : 'link_hovered' }}
        cursor="pointer"
      />
    </IconButton>
  );
};

export default chakra(React.forwardRef(NetworkMenuButton));
