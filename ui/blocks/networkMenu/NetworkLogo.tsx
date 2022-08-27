import { Icon, Box, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import logoIcon from 'icons/logo.svg';
import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';

interface Props {
  isCollapsed?: boolean;
  onClick?: () => void;
}

const NetworkLogo = ({ isCollapsed, onClick }: Props) => {
  const logoColor = useColorModeValue('blue.600', 'white');

  return (
    <Box
      width={ isCollapsed ? '0' : '113px' }
      display="inline-flex"
      overflow="hidden"
      onClick={ onClick }
      { ...getDefaultTransitionProps({ transitionProperty: 'width' }) }
    >
      <Icon
        as={ logoIcon }
        width="113px"
        height="20px"
        color={ logoColor }
        { ...getDefaultTransitionProps() }
      />
    </Box>
  );
};

export default React.memo(NetworkLogo);
