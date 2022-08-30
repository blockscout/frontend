import { Icon, Box, useColorModeValue } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import logoIcon from 'icons/logo.svg';
import useBasePath from 'lib/hooks/useBasePath';
import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';

interface Props {
  isCollapsed?: boolean;
  onClick?: (event: React.SyntheticEvent) => void;
}

const NetworkLogo = ({ isCollapsed, onClick }: Props) => {
  const logoColor = useColorModeValue('blue.600', 'white');
  const href = useBasePath();

  return (
    <NextLink href={ href } passHref>
      <Box
        as="a"
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
    </NextLink>
  );
};

export default React.memo(NetworkLogo);
