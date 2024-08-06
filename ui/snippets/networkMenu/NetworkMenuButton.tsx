import { useColorModeValue, Button, forwardRef, chakra } from '@chakra-ui/react';
import React from 'react';

import colors from 'theme/foundations/colors';
import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  isMobile?: boolean;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

const NetworkMenuButton = ({ isMobile, isActive, onClick, className }: Props, ref: React.ForwardedRef<HTMLButtonElement>) => {
  const defaultIconColor = useColorModeValue('gray.600', colors.grayTrue[200]);
  const bgColorMobile = useColorModeValue('blue.50', colors.grayTrue[900]);
  const iconColorMobile = useColorModeValue('blue.700', colors.grayTrue[200]);

  return (
    <Button
      className={ className }
      variant="unstyled"
      display="inline-flex"
      alignItems="center"
      ref={ ref }
      h="36px"
      borderRadius="base"
      backgroundColor={ isActive ? bgColorMobile : 'none' }
      onClick={ onClick }
      aria-label="Network menu"
      aria-roledescription="menu"
    >
      <IconSvg
        name="networks"
        width="36px"
        height="36px"
        padding="10px"
        color={ isActive ? iconColorMobile : defaultIconColor }
        _hover={{ color: isMobile ? undefined : 'link_hovered' }}
        cursor="pointer"
        { ...getDefaultTransitionProps({ transitionProperty: 'margin' }) }
      />
    </Button>
  );
};

export default chakra(forwardRef(NetworkMenuButton));
