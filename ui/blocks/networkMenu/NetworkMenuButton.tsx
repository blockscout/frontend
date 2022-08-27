import { Icon, useColorModeValue, Button } from '@chakra-ui/react';
import React from 'react';

import networksIcon from 'icons/networks.svg';
import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';

interface Props {
  isCollapsed?: boolean;
  isMobile?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

const NetworkMenuButton = ({ isCollapsed, isMobile, isActive, onClick }: Props, ref: React.ForwardedRef<HTMLButtonElement>) => {
  const defaultIconColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Button
      variant="unstyled"
      display="inline-flex"
      alignSelf="stretch"
      alignItems="center"
      ref={ ref }
      h="36px"
      borderRadius="base"
      backgroundColor={ isMobile && isActive ? 'blue.50' : 'none' }
      onClick={ onClick }
    >
      <Icon
        as={ networksIcon }
        width="36px"
        height="36px"
        padding="10px"
        color={ isMobile && isActive ? 'blue.700' : defaultIconColor }
        _hover={{ color: isMobile ? undefined : 'blue.400' }}
        marginLeft={ isCollapsed ? '0px' : '7px' }
        cursor="pointer"
        { ...getDefaultTransitionProps({ transitionProperty: 'margin' }) }
      />
    </Button>
  );
};

export default React.forwardRef(NetworkMenuButton);
