import { Icon, useColorModeValue, Button } from '@chakra-ui/react';
import React from 'react';

import networksIcon from 'icons/networks.svg';
import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';

interface Props {
  isMobile?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

const NetworkMenuButton = ({ isMobile, isActive, onClick }: Props, ref: React.ForwardedRef<HTMLButtonElement>) => {
  const defaultIconColor = useColorModeValue('gray.600', 'gray.400');
  const bgColorMobile = useColorModeValue('blue.50', 'gray.800');
  const iconColorMobile = useColorModeValue('blue.700', 'blue.50');

  return (
    <Button
      variant="unstyled"
      display="inline-flex"
      alignSelf="stretch"
      alignItems="center"
      ref={ ref }
      h="36px"
      borderRadius="base"
      backgroundColor={ isActive ? bgColorMobile : 'none' }
      onClick={ onClick }
      aria-label="Network menu"
      aria-roledescription="menu"
    >
      <Icon
        as={ networksIcon }
        width="36px"
        height="36px"
        padding="10px"
        color={ isActive ? iconColorMobile : defaultIconColor }
        _hover={{ color: isMobile ? undefined : 'blue.400' }}
        cursor="pointer"
        { ...getDefaultTransitionProps({ transitionProperty: 'margin' }) }
      />
    </Button>
  );
};

export default React.forwardRef(NetworkMenuButton);
