import { Icon, Box, Image, useColorModeValue } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import type { FunctionComponent, SVGAttributes } from 'react';

import blockscoutLogo from 'icons/logo.svg';
import useNetwork from 'lib/hooks/useNetwork';
import useLink from 'lib/link/useLink';
import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';

interface Props {
  isCollapsed?: boolean;
  onClick?: (event: React.SyntheticEvent) => void;
}

const NetworkLogo = ({ isCollapsed, onClick }: Props) => {
  const logoColor = useColorModeValue('blue.600', 'white');
  const link = useLink();
  const href = link('network_index');
  const network = useNetwork();
  const logo = network?.logo;

  const style = useColorModeValue({}, { filter: 'brightness(0) invert(1)' });

  let logoEl;

  if (logo && typeof logo === 'string') {
    logoEl = (
      <Image
        h="20px"
        src={ logo }
        alt={ `${ network.type } ${ network.subType ? network.subType : '' } network icon` }
      />
    );
  } else if (typeof logo !== undefined) {
    logoEl = (
      <Icon
        as={ logo as FunctionComponent<SVGAttributes<SVGElement>> }
        width="auto"
        height="20px"
        { ...getDefaultTransitionProps() }
        style={ style }
      />
    );
  } else {
    <Icon
      as={ blockscoutLogo }
      width="113px"
      height="20px"
      color={ logoColor }
      { ...getDefaultTransitionProps() }
      style={ style }
    />;
  }

  return (
    <NextLink href={ href } passHref>
      <Box
        as="a"
        width={{ base: '113px', lg: isCollapsed === false ? '113px' : 0, xl: isCollapsed ? '0' : '113px' }}
        display="inline-flex"
        overflow="hidden"
        onClick={ onClick }
        { ...getDefaultTransitionProps({ transitionProperty: 'width' }) }
        aria-label="Link to main page"
      >
        { logoEl }
      </Box>
    </NextLink>
  );
};

export default React.memo(NetworkLogo);
